import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 8000);
const host = process.env.HOST ?? '127.0.0.1';

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello from Babylone, Corentin and Aurora!');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(port, host, () => {
  console.log(`listening on http://${host}:${port}`);
});
