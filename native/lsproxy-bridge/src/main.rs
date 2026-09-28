#[cfg(not(unix))]
compile_error!("The experimental bridge currently requires Unix domain sockets");

use std::collections::HashMap;
use std::env;
use std::ffi::OsString;
use std::fs::{self, DirBuilder, Permissions};
use std::io::{self, Read, Write};
use std::os::unix::fs::{DirBuilderExt, FileTypeExt, PermissionsExt};
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::{Path, PathBuf};
use std::process::{ChildStdin, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, SyncSender};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

const DATA: u8 = 1;
const OPEN: u8 = 2;
const CLOSE: u8 = 3;
const INPUT_CLOSED: u8 = 4;
const MAX_FRAME_SIZE: usize = 16 * 1024 * 1024;
const COPY_CHUNK_SIZE: usize = 16 * 1024;
const OUTPUT_QUEUE_FRAMES: usize = 64;

struct SessionOutput {
    sender: SyncSender<Vec<u8>>,
    socket: Arc<UnixStream>,
}

struct Frame {
    kind: u8,
    session: u32,
    payload: Vec<u8>,
}

fn write_frame(writer: &mut impl Write, kind: u8, session: u32, payload: &[u8]) -> io::Result<()> {
    if payload.len() > MAX_FRAME_SIZE {
        return Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "bridge frame too large",
        ));
    }
    let mut header = [0_u8; 9];
    header[0] = kind;
    header[1..5].copy_from_slice(&session.to_be_bytes());
    header[5..9].copy_from_slice(&(payload.len() as u32).to_be_bytes());
    writer.write_all(&header)?;
    writer.write_all(payload)
}

fn read_frame(reader: &mut impl Read) -> io::Result<Option<Frame>> {
    let mut header = [0_u8; 9];
    if reader.read(&mut header[..1])? == 0 {
        return Ok(None);
    }
    reader.read_exact(&mut header[1..])?;
    let kind = header[0];
    let session = u32::from_be_bytes(header[1..5].try_into().expect("fixed-width session"));
    let size = u32::from_be_bytes(header[5..9].try_into().expect("fixed-width size")) as usize;
    if !matches!(kind, DATA | OPEN | CLOSE | INPUT_CLOSED)
        || session == 0
        || size > MAX_FRAME_SIZE
        || (kind != DATA && size != 0)
    {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            format!("invalid bridge frame: kind={kind} session={session} size={size}"),
        ));
    }
    let mut payload = vec![0_u8; size];
    reader.read_exact(&mut payload)?;
    Ok(Some(Frame {
        kind,
        session,
        payload,
    }))
}

fn client(path: &Path) -> io::Result<()> {
    let mut socket = UnixStream::connect(path)?;
    let mut upload = socket.try_clone()?;
    thread::spawn(move || {
        let _ = io::copy(&mut io::stdin().lock(), &mut upload);
        let _ = upload.shutdown(std::net::Shutdown::Write);
    });
    io::copy(&mut socket, &mut io::stdout().lock())?;
    Ok(())
}

struct SocketFile(PathBuf);

impl Drop for SocketFile {
    fn drop(&mut self) {
        let _ = fs::remove_file(&self.0);
    }
}

fn bind_socket(path: &Path) -> io::Result<(UnixListener, SocketFile)> {
    if let Some(parent) = path.parent() {
        DirBuilder::new()
            .recursive(true)
            .mode(0o700)
            .create(parent)?;
    }
    match fs::symlink_metadata(path) {
        Ok(metadata) if metadata.file_type().is_socket() => match UnixStream::connect(path) {
            Ok(_) => {
                return Err(io::Error::new(
                    io::ErrorKind::AddrInUse,
                    "bridge socket is live",
                ));
            }
            Err(error) if error.kind() == io::ErrorKind::ConnectionRefused => {
                fs::remove_file(path)?;
            }
            Err(error) => return Err(error),
        },
        Ok(_) => {
            return Err(io::Error::new(
                io::ErrorKind::AlreadyExists,
                "socket path is not a socket",
            ));
        }
        Err(error) if error.kind() == io::ErrorKind::NotFound => {}
        Err(error) => return Err(error),
    }
    let listener = UnixListener::bind(path)?;
    let guard = SocketFile(path.to_path_buf());
    fs::set_permissions(path, Permissions::from_mode(0o600))?;
    listener.set_nonblocking(true)?;
    Ok((listener, guard))
}

fn send(input: &Arc<Mutex<ChildStdin>>, kind: u8, session: u32, data: &[u8]) -> io::Result<()> {
    let mut writer = input
        .lock()
        .map_err(|_| io::Error::other("daemon stdin lock poisoned"))?;
    write_frame(&mut *writer, kind, session, data)
}

fn serve(path: &Path, program: &OsString, arguments: &[OsString]) -> io::Result<()> {
    let (listener, _socket_file) = bind_socket(path)?;
    let mut child = Command::new(program)
        .args(arguments)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()?;
    let input = Arc::new(Mutex::new(child.stdin.take().expect("piped daemon stdin")));
    let mut output = child.stdout.take().expect("piped daemon stdout");
    let sessions = Arc::new(Mutex::new(HashMap::<u32, SessionOutput>::new()));
    let running = Arc::new(AtomicBool::new(true));

    let output_sessions = Arc::clone(&sessions);
    let output_input = Arc::clone(&input);
    let output_running = Arc::clone(&running);
    let output_thread = thread::spawn(move || -> io::Result<()> {
        let result = (|| {
            loop {
                let frame = match read_frame(&mut output)? {
                    Some(frame) => frame,
                    None => return Ok(()),
                };
                match frame.kind {
                    DATA => {
                        let target = output_sessions
                            .lock()
                            .map_err(|_| io::Error::other("session lock poisoned"))?
                            .get(&frame.session)
                            .map(|entry| entry.sender.clone());
                        if let Some(sender) = target
                            && sender.try_send(frame.payload).is_err()
                        {
                            if let Some(entry) = output_sessions
                                .lock()
                                .map_err(|_| io::Error::other("session lock poisoned"))?
                                .remove(&frame.session)
                            {
                                let _ = entry.socket.shutdown(std::net::Shutdown::Both);
                            }
                            send(&output_input, CLOSE, frame.session, &[])?;
                        }
                    }
                    CLOSE => {
                        let target = output_sessions
                            .lock()
                            .map_err(|_| io::Error::other("session lock poisoned"))?
                            .remove(&frame.session);
                        // Dropping the sender lets its writer drain queued DATA
                        // before closing the socket's output half.
                        drop(target);
                    }
                    OPEN | INPUT_CLOSED => {}
                    _ => unreachable!(),
                }
            }
        })();
        output_running.store(false, Ordering::Release);
        if let Ok(mut sockets) = output_sessions.lock() {
            for (_, entry) in sockets.drain() {
                let _ = entry.socket.shutdown(std::net::Shutdown::Both);
            }
        }
        result
    });

    let mut next_session = 1_u32;
    let mut writers = Vec::new();
    let mut child_status = None;
    let mut serve_error = None;
    while running.load(Ordering::Acquire) {
        match child.try_wait() {
            Ok(Some(status)) => {
                child_status = Some(status);
                break;
            }
            Ok(None) => {}
            Err(error) => {
                serve_error = Some(error);
                break;
            }
        }
        match listener.accept() {
            Ok((mut socket, _)) => {
                let accepted = (|| -> io::Result<()> {
                    let session = next_session;
                    socket.set_nonblocking(false)?;
                    next_session = next_session
                        .checked_add(1)
                        .ok_or_else(|| io::Error::other("bridge session IDs exhausted"))?;
                    socket.set_write_timeout(Some(Duration::from_secs(10)))?;
                    let writable = Arc::new(socket.try_clone()?);
                    let (sender, receiver) = mpsc::sync_channel::<Vec<u8>>(OUTPUT_QUEUE_FRAMES);
                    sessions
                        .lock()
                        .map_err(|_| io::Error::other("session lock poisoned"))?
                        .insert(
                            session,
                            SessionOutput {
                                sender,
                                socket: Arc::clone(&writable),
                            },
                        );
                    send(&input, OPEN, session, &[])?;
                    let writer_input = Arc::clone(&input);
                    let writer_sessions = Arc::clone(&sessions);
                    writers.retain(|writer: &thread::JoinHandle<()>| !writer.is_finished());
                    writers.push(thread::spawn(move || {
                        for payload in receiver {
                            let mut stream = &*writable;
                            if stream.write_all(&payload).is_err() {
                                let removed = writer_sessions
                                    .lock()
                                    .ok()
                                    .and_then(|mut sockets| sockets.remove(&session));
                                if let Some(entry) = removed {
                                    let _ = entry.socket.shutdown(std::net::Shutdown::Both);
                                    let _ = send(&writer_input, CLOSE, session, &[]);
                                }
                                break;
                            }
                        }
                        let _ = writable.shutdown(std::net::Shutdown::Write);
                    }));
                    let session_input = Arc::clone(&input);
                    let session_sockets = Arc::clone(&sessions);
                    thread::spawn(move || {
                        let mut buffer = [0_u8; COPY_CHUNK_SIZE];
                        loop {
                            match socket.read(&mut buffer) {
                                Ok(0) => {
                                    let _ = send(&session_input, INPUT_CLOSED, session, &[]);
                                    break;
                                }
                                Ok(count) => {
                                    if send(&session_input, DATA, session, &buffer[..count])
                                        .is_err()
                                    {
                                        break;
                                    }
                                }
                                Err(_) => {
                                    let removed = session_sockets
                                        .lock()
                                        .ok()
                                        .and_then(|mut sockets| sockets.remove(&session));
                                    if let Some(entry) = removed {
                                        let _ = entry.socket.shutdown(std::net::Shutdown::Both);
                                    }
                                    let _ = send(&session_input, CLOSE, session, &[]);
                                    break;
                                }
                            }
                        }
                    });
                    Ok(())
                })();
                if let Err(error) = accepted {
                    serve_error = Some(error);
                    break;
                }
            }
            Err(error) if error.kind() == io::ErrorKind::WouldBlock => {
                thread::sleep(Duration::from_millis(10));
            }
            Err(error) => {
                serve_error = Some(error);
                break;
            }
        }
    }

    running.store(false, Ordering::Release);
    let mut stopped_early = false;
    let status = if let Some(status) = child_status {
        status
    } else if let Some(status) = child.try_wait()? {
        status
    } else {
        stopped_early = serve_error.is_none();
        let _ = child.kill();
        child.wait()?
    };
    let output_result = output_thread
        .join()
        .map_err(|_| io::Error::other("daemon output reader panicked"))?;
    for writer in writers {
        writer
            .join()
            .map_err(|_| io::Error::other("session writer panicked"))?;
    }
    if let Some(error) = serve_error {
        return Err(error);
    }
    output_result?;
    if stopped_early {
        return Err(io::Error::other("daemon stdout closed before process exit"));
    }
    if !status.success() {
        return Err(io::Error::other(format!("daemon exited with {status}")));
    }
    Ok(())
}

fn run() -> io::Result<()> {
    let mut args = env::args_os().skip(1);
    let mode = args
        .next()
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "expected client or server"))?;
    let path = PathBuf::from(
        args.next()
            .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "expected socket path"))?,
    );
    match mode.to_str() {
        Some("client") if args.next().is_none() => client(&path),
        Some("server") => {
            if args.next().as_deref() != Some(std::ffi::OsStr::new("--")) {
                return Err(io::Error::new(
                    io::ErrorKind::InvalidInput,
                    "expected -- before daemon command",
                ));
            }
            let program = args.next().ok_or_else(|| {
                io::Error::new(io::ErrorKind::InvalidInput, "expected daemon command")
            })?;
            serve(&path, &program, &args.collect::<Vec<_>>())
        }
        _ => Err(io::Error::new(
            io::ErrorKind::InvalidInput,
            "usage: lsproxy-bridge client <socket> | server <socket> -- <daemon> [args...]",
        )),
    }
}

fn main() {
    if let Err(error) = run() {
        eprintln!("lsproxy-bridge: {error}");
        std::process::exit(1);
    }
}
