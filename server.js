const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = Number.parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`PlayBimboo frontend ready on http://${hostname}:${port}`);
  });

  server.on('error', (error) => {
    console.error('Frontend server error:', error);
    process.exit(1);
  });

  module.exports = server;
}).catch((error) => {
  console.error('Failed to start Next.js frontend:', error);
  process.exit(1);
});
