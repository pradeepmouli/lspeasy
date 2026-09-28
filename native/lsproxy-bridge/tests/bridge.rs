#![cfg(unix)]

use std::fs;
use std::io::{Read, Write};
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

struct TestDir(PathBuf);
static NEXT_DIR: AtomicU64 = AtomicU64::new(0);

impl TestDir {
    fn new() -> Self {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let sequence = NEXT_DIR.fetch_add(1, Ordering::Relaxed);
        let path = std::env::temp_dir().join(format!(
            "lsproxy-bridge-{}-{nonce}-{sequence}",
            std::process::id()
        ));
        fs::create_dir(&path).unwrap();
        Self(path)
    }

    fn socket(&self) -> PathBuf {
        self.0.join("bridge.sock")
    }
}

impl Drop for TestDir {
    fn drop(&mut self) {
        let _ = fs::remove_dir_all(&self.0);
    }
}

fn binary() -> &'static str {
    env!("CARGO_BIN_EXE_lsproxy-bridge")
}

#[test]
fn client_forwards_binary_bytes_after_stdin_eof() {
    let dir = TestDir::new();
    let listener = UnixListener::bind(dir.socket()).unwrap();
    let server = thread::spawn(move || {
        let (mut stream, _) = listener.accept().unwrap();
        let mut bytes = Vec::new();
        stream.read_to_end(&mut bytes).unwrap();
        stream.write_all(&bytes).unwrap();
    });
    let mut client = Command::new(binary())
        .arg("client")
        .arg(dir.socket())
        .arg("--ready")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .unwrap();
    let bytes = b"Content-Length: 5\r\n\r\n\0\xff\r\n";
    client.stdin.take().unwrap().write_all(bytes).unwrap();
    let output = client.wait_with_output().unwrap();
    server.join().unwrap();
    assert!(output.status.success());
    assert_eq!(output.stdout, bytes);
    assert_eq!(output.stderr, b"LSPROXY_BRIDGE_READY\n");
}

#[test]
fn probe_reports_socket_connectivity() {
    let dir = TestDir::new();
    let missing = Command::new(binary())
        .arg("probe")
        .arg(dir.socket())
        .status()
        .unwrap();
    assert!(!missing.success());
    let listener = UnixListener::bind(dir.socket()).unwrap();
    let available = Command::new(binary())
        .arg("probe")
        .arg(dir.socket())
        .status()
        .unwrap();
    assert!(available.success());
    listener.accept().unwrap();
}

#[test]
fn short_lived_probe_does_not_stop_server() {
    let dir = TestDir::new();
    let mut server = Command::new(binary())
        .arg("server")
        .arg(dir.socket())
        .args(["--", "/bin/cat"])
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .unwrap();
    let socket = dir.socket();
    for _ in 0..100 {
        if socket.exists() {
            break;
        }
        thread::sleep(Duration::from_millis(10));
    }
    assert!(socket.exists());
    for _ in 0..3 {
        assert!(
            Command::new(binary())
                .arg("probe")
                .arg(&socket)
                .status()
                .unwrap()
                .success()
        );
    }
    thread::sleep(Duration::from_millis(100));
    assert!(
        server.try_wait().unwrap().is_none(),
        "probe stopped the server"
    );

    let mut client = UnixStream::connect(&socket).unwrap();
    client
        .set_read_timeout(Some(Duration::from_secs(2)))
        .unwrap();
    client.write_all(b"still alive").unwrap();
    let mut reply = [0_u8; 11];
    client.read_exact(&mut reply).unwrap();
    assert_eq!(&reply, b"still alive");
    server.kill().unwrap();
    server.wait().unwrap();
}

#[test]
fn server_routes_concurrent_sessions_without_mixing_bytes() {
    let dir = TestDir::new();
    let mut server = Command::new(binary())
        .arg("server")
        .arg(dir.socket())
        .arg("--")
        .arg("/bin/cat")
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .unwrap();
    let socket = dir.socket();
    let mut first = (0..100)
        .find_map(|_| {
            let connected = UnixStream::connect(&socket).ok();
            if connected.is_none() {
                thread::sleep(Duration::from_millis(10));
            }
            connected
        })
        .expect("bridge server did not start");
    let mut second = UnixStream::connect(&socket).unwrap();
    first
        .set_read_timeout(Some(Duration::from_secs(2)))
        .unwrap();
    second
        .set_read_timeout(Some(Duration::from_secs(2)))
        .unwrap();

    let a = b"first:\0\xff";
    let b = b"second:\x01\xfe";
    first.write_all(a).unwrap();
    second.write_all(b).unwrap();
    let mut echoed_a = vec![0; a.len()];
    let mut echoed_b = vec![0; b.len()];
    first.read_exact(&mut echoed_a).unwrap();
    second.read_exact(&mut echoed_b).unwrap();
    assert_eq!(echoed_a, a);
    assert_eq!(echoed_b, b);

    server.kill().unwrap();
    server.wait().unwrap();
}

#[test]
fn server_drains_data_before_closing_session() {
    let dir = TestDir::new();
    // Consume OPEN, then emit one DATA frame followed immediately by CLOSE.
    let daemon = "dd bs=9 count=1 of=/dev/null 2>/dev/null; printf '\\001\\000\\000\\000\\001\\000\\000\\000\\005hello\\003\\000\\000\\000\\001\\000\\000\\000\\000'";
    let mut server = Command::new(binary())
        .arg("server")
        .arg(dir.socket())
        .args(["--", "/bin/sh", "-c", daemon])
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .spawn()
        .unwrap();
    let socket = dir.socket();
    let mut client = (0..100)
        .find_map(|_| {
            let connected = UnixStream::connect(&socket).ok();
            if connected.is_none() {
                thread::sleep(Duration::from_millis(10));
            }
            connected
        })
        .expect("bridge server did not start");
    client
        .set_read_timeout(Some(Duration::from_secs(2)))
        .unwrap();
    let mut reply = Vec::new();
    client.read_to_end(&mut reply).unwrap();
    assert_eq!(reply, b"hello");
    assert!(server.wait().unwrap().success());
}

#[test]
fn server_refuses_to_replace_regular_file() {
    let dir = TestDir::new();
    fs::write(dir.socket(), b"keep me").unwrap();
    let status = Command::new(binary())
        .arg("server")
        .arg(dir.socket())
        .arg("--")
        .arg("/bin/cat")
        .status()
        .unwrap();
    assert!(!status.success());
    assert_eq!(fs::read(dir.socket()).unwrap(), b"keep me");
}

#[test]
fn server_reports_daemon_failure() {
    let dir = TestDir::new();
    let output = Command::new(binary())
        .arg("server")
        .arg(dir.socket())
        .args(["--", "/bin/sh", "-c", "exit 7"])
        .output()
        .unwrap();
    assert!(!output.status.success());
    assert!(String::from_utf8_lossy(&output.stderr).contains("daemon exited with"));
}

#[test]
fn server_reports_malformed_daemon_output() {
    let dir = TestDir::new();
    let output = Command::new(binary())
        .arg("server")
        .arg(dir.socket())
        .args(["--", "/bin/sh", "-c", "printf invalid-frame"])
        .output()
        .unwrap();
    assert!(!output.status.success());
}
