import fs from 'fs';
import path from 'path';

const nextDir = path.resolve(process.cwd(), '.next');

async function clean() {
  try {
    await fs.promises.rm(nextDir, { recursive: true, force: true });
    console.log('.next removed');
  } catch (err) {
    console.warn('Could not remove .next cleanly:', err?.message || err);
    // No throw so build can continue
  }
}

clean();
