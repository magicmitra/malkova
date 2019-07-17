const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
    if(req.url === '/' && req.method === 'GET') {
        res.writeHead(200, {
            'schlong': 'undefined',
        });
        res.end('server');
        return;
    }

    if(req.url === '/status' && req.method === 'GET') {
        const status = {
            up: true,
            schlong: 'up',
            timestamp: Date.now(),
            OS: 'kali linux',
        }
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(status));
    }
});

server.listen(5000, () => console.log('server listening on PORT 5000'));