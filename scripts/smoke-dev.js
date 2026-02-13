/* eslint-disable no-console */
import { spawn } from 'child_process';

const timeout = 20000; // ms
const needle = /Local:|ready in|running at/i;

const viteCli = 'node_modules/vite/bin/vite.js';
const proc = spawn(process.execPath, [viteCli], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
});

let resolved = false;

const done = (code) => {
    if (resolved) return;
    resolved = true;
    proc.kill();
    process.exit(code);
};

proc.stdout.on('data', (chunk) => {
    const s = chunk.toString();
    process.stdout.write(s);
    if (needle.test(s)) {
        console.log('\n✅ Vite dev server started — smoke check passed');
        done(0);
    }
});

proc.stderr.on('data', (chunk) => {
    const s = chunk.toString();
    process.stderr.write(s);
});

setTimeout(() => {
    if (!resolved) {
        console.error('\n⛔️ Vite dev did not start within timeout');
        done(2);
    }
}, timeout);
