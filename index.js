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

    // Force serving static files from .next/static
    server.use('/_next/static', express.static(path.join(__dirname, '.next/static')));
    
    // Force serving files from public folder
    server.use(express.static(path.join(__dirname, 'public')));

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
