// Builds the web app, then refreshes the copy that the "Desktop app (.zip)"
// download and the Python launcher serve (public/offline_dist and
// python_project/offline_ui). Run with: npm run build:offline
import { execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const copyDist = (target) => {
  rmSync(target, { recursive: true, force: true });
  for (const entry of readdirSync('dist')) {
    if (entry === 'offline_dist') continue; // never nest the copy inside itself
    cpSync(join('dist', entry), join(target, entry), { recursive: true });
  }
  console.log(`✓ refreshed ${target}`);
};

run('npx vite build');
copyDist('public/offline_dist');
if (existsSync('python_project')) copyDist('python_project/offline_ui');
// second build so the deployed site serves the fresh offline copy too
run('npx vite build');
