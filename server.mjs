import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = fileURLToPath(new URL(process.argv[2] || '.', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const candidate = normalize(join(base, pathname));
    let path = candidate.startsWith(base) ? candidate : join(base, 'index.html');
    try { if ((await stat(path)).isDirectory()) path = join(path, 'index.html'); } catch { path = join(base, 'index.html'); }
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Unable to load this demo file.'); }
});
const requestedPort = Number(process.env.PORT || 4173);
const canChooseFallback = !process.env.PORT;
function listen(port) {
  const onError = error => {
    if (error.code === 'EADDRINUSE' && canChooseFallback && port < requestedPort + 10) {
      console.warn(`Port ${port} is already in use; trying ${port + 1}.`);
      listen(port + 1);
      return;
    }
    console.error(`Unable to start MediOTO AI on port ${port}: ${error.message}`);
    if (error.code === 'EADDRINUSE') console.error('Set PORT to an available port and try again.');
    process.exitCode = 1;
  };
  server.once('error', onError);
  server.listen(port, '0.0.0.0', () => {
    server.off('error', onError);
    console.log(`MediOTO AI available at http://localhost:${port}/demo?sample=mixed`);
  });
}
listen(requestedPort);
