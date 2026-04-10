const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const fs = require('fs');
    const rootDir = process.cwd();

    const staticPath = path.join(rootDir, '.next', 'static');
    const publicPath = path.join(rootDir, 'public');
    
    console.log('--- DIAGNOSTIC HOSTINGER ---');
    console.log('Root Directory:', rootDir);
    console.log('Static Path:', staticPath);
    console.log('Static Exists:', fs.existsSync(staticPath) ? 'YES' : 'NO');
    console.log('Public Path:', publicPath);
    console.log('Public Exists:', fs.existsSync(publicPath) ? 'YES' : 'NO');

    // Explicitly serve static files with proxy buffering disabled
    server.use('/_next/static', (req, res, next) => {
        res.setHeader('X-Accel-Buffering', 'no'); // Désactive le tampon Hostinger
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        next();
    }, express.static(staticPath));

    server.use((req, res, next) => {
        if (req.url.startsWith('/_next/static')) {
            console.log(`[ASSET REQUEST] ${req.url} - Found: ${fs.existsSync(path.join(staticPath, req.url.replace('/_next/static', '')))}`);
        }
        next();
    }, express.static(publicPath));

    // Handle all other routes with Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) {
            console.error('SERVER ERROR:', err);
            throw err;
        }
        console.log(`--- TAW10 SERVER READY ---`);
        console.log(`Port: ${port}`);
        console.log(`Mode: ${process.env.NODE_ENV}`);
    });
}).catch((ex) => {
    console.error('CRITICAL STARTUP ERROR:', ex.stack);
    process.exit(1);
});
