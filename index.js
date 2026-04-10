const path = require('path');

// Configuration de l'environnement pour Hostinger
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = '0.0.0.0';

console.log('--- STARTING STANDALONE SERVER ---');
console.log('Port:', process.env.PORT);

// On lance le serveur généré par Next.js dans le dossier standalone
require(path.join(__dirname, '.next', 'standalone', 'server.js'));
