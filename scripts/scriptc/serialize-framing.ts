// Compile with: pnpm dlx scriptc@0.1.7 build scripts/scriptc/serialize-framing.ts -o /tmp/lspeasy-serialize-framing
import { serializeMessage } from '../../packages/core/src/jsonrpc/framing.js';

const message = {
  jsonrpc: '2.0' as const,
  id: 1,
  result: { text: '𝄞🙂', vendor: null, list: [null, 2] }
};

process.stdout.write(serializeMessage(message));
