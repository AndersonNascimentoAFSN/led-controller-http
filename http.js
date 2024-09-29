import http from 'http'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = networkInterfaces()?.enp3s0f1?.at(0)?.address

// Function to handle file requests
const serveFile = (filePath, contentType, res) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, send 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        // Some server error, send 500
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      // Success, send the content
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the base directory for static files
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // Get the file extension
  let extname = String(path.extname(filePath)).toLowerCase();

  // Set default content type
  let contentType = 'text/html';

  // Map file extension to MIME type
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  // Set the content type based on the file extension
  contentType = mimeTypes[extname] || 'application/octet-stream';

  // Serve the file
  serveFile(filePath, contentType, res);
});

// Specify the port and host for the server
const PORT = 8080;
server.listen(PORT, `${host}`, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});