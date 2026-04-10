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
    let rootDir = process.cwd();
    
    // Si on est dans le dossier nodejs, on remonte d'un cran pour trouver le vrai .next du build
    if (rootDir.endsWith('nodejs')) {
        rootDir = path.join(rootDir, '..');
    }

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
            const relativePath = req.url.substring('/_next/static'.length);
            const fullPath = path.join(staticPath, relativePath);
            const exists = fs.existsSync(fullPath);
            console.log(`[ASSET REQUEST] ${req.url} -> Found: ${exists}`);
            if (!exists && req.url.includes('chunks')) {
                // Diagnostic : on regarde ce qu'il y a dans le dossier chunks si on ne trouve pas
                try {
                    const chunksDir = path.join(staticPath, 'chunks');
                    if (fs.existsSync(chunksDir)) {
                        const files = fs.readdirSync(chunksDir).slice(0, 5);
                        console.log(`[DEBUG] Files in chunks dir: ${files.join(', ')}`);
                    }
                } catch (e) {}
            }
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
