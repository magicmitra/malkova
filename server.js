const http = require('http'); // node http module
const url = require('url'); // node URL module
const db = require('./db');

const server = http.createServer();

/**
 * Listens for a 'request' event on the server
 * event will be fired anytime some client makes a request
 * takes a callback with requst and response 
 */
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
        return res.end(JSON.stringify(status));
    }

    const parsedURL = url.parse(req.url, true);

    // SET
    if(parsedURL.pathname === '/set' && req.method === 'PATCH') {
        return db
            .set(parsedURL.query.file, parsedURL.query.key, parsedURL.query.value)
            .then(() => {
                res.end('value set');
            })
            .catch(err => {
                // TODO: handle errors
            });
    }

    // REMOVE
    if(parsedURL.pathname === '/remove' && req.method === 'PATCH') {
        return db
            .remove(parsedURL.query.file, parsedURL.query.key)
            .then(() => {
                res.end('key deleted');
            })
            .catch(err => {
                //TODO
            });
    }

    // DELETEFILE
    if(parsedURL.pathname === '/deleteFile' && req.method === 'DELETE') {
        return db   
            .deleteFile(parsedURL.query.file)
            .then(() => {
                res.end('file deleted')
            })
            .catch(err => {
                // TODO
            });
    }

    // CREATEFILE
    if(parsedURL.pathname === '/createFile' && req.method === 'POST') {
        return db   
            .createFile(parsedURL.query.file)
            .then(() => {
                res.end('file created');
            })
            .catch(err => {
                // TODO
            });
    }

    // MERGEDATA
    if(parsedURL.pathname === '/mergeData' && req.method === 'GET') {
        return db
            .mergeData()
            .then(() => {
                res.end('file merged');
            })
            .catch(err => {
                // TODO
            });
    }

    // UNION
    if(parsedURL.pathname === '/union' && req.method === 'GET') {
        return db   
            .union(parsedURL.query.fileA, parsedURL.query.fileB)
            .then(() => {
                res.end('union established');
            })
            .catch(err => {
                // TODO
            });
    }

    // INTERSECT
    if(parsedURL.pathname === '/intersect' && req.method === 'GET') {
        return db   
            .intersect(parsedURL.query.fileA, parsedURL.query.fileB)
            .then(() => {
                res.end('intersection established');
            })
            .catch(err => {
                // TODO
            });
    }

    // DIFFERENCE
    if(parsedURL.pathname === '/difference' && req.method === 'GET') {
        return db   
            .difference(parsedURL.query.fileA, parsedURL.query.fileB)
            .then(() => {
                res.end('difference established');
            })
            .catch(err => {
                // TODO
            });
    }
});

server.listen(5000, () => console.log('server listening on PORT 5000'));