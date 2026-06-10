import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const standaloneDir = join(process.cwd(), '.next', 'standalone');
const standaloneNextDir = join(standaloneDir, '.next');

if (!existsSync(standaloneDir)) {
  throw new Error('Missing .next/standalone. Ensure next.config.ts has output: "standalone".');
}

mkdirSync(standaloneNextDir, { recursive: true });
cpSync(join(process.cwd(), '.next', 'static'), join(standaloneNextDir, 'static'), { recursive: true });
cpSync(join(process.cwd(), 'public'), join(standaloneDir, 'public'), { recursive: true });
