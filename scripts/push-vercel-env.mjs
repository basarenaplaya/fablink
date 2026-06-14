/**
 * Push .env.local variables to Vercel production environment.
 * Usage: node scripts/push-vercel-env.mjs
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ENV_PATH = resolve(process.cwd(), '.env.local');
const TARGET = 'production';

function parseEnvFile(content) {
  const values = {};
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value.replace(/\\n/g, '\n');
  }

  return values;
}

function runVercel(args, input) {
  const result = spawnSync('npx', ['-y', 'vercel@latest', ...args], {
    input,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error(`vercel ${args.join(' ')} failed with code ${result.status}`);
  }
}

const env = parseEnvFile(readFileSync(ENV_PATH, 'utf8'));

for (const [key, value] of Object.entries(env)) {
  try {
    runVercel(['env', 'rm', key, TARGET, '--yes'], undefined);
  } catch {
    // Variable may not exist yet.
  }

  runVercel(['env', 'add', key, TARGET, '--force', '--yes', '--sensitive'], value);
  console.log(`Set ${key} (${TARGET})`);
}

console.log('Vercel production environment variables synced.');
