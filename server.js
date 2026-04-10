const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

console.log('--- STARTING TAW10 SERVER ---');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Target Port:', port);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    })
      .listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  })
  .catch((ex) => {
    console.error('CRITICAL ERROR: Failed to prepare Next.js app');
    console.error(ex.stack);
    process.exit(1);
  });
