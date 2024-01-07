const http = require('http');
const fs = require('fs');
const axios = require('axios');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/') {
        res.end('Hello World');
    }
    else if (parsedUrl.pathname === '/script.js') {
        const apiKey = parsedUrl.query.key;
        if (!apiKey) {
            res.writeHead(400);
            return res.end('API key is missing');
        }
        const apiUrl = `https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/nysbip-customer-valid?API-key=${apiKey}`;

        axios.get(apiUrl)
            .then(apiRes => {
                const result = apiRes.data;
                console.log(apiUrl);

                if (result === false) {
                    res.writeHead(400);
                    res.end('Error: API returned false');
                } else {
                    fs.readFile('./script.js', (err, scriptData) => {
                        if (err) {
                            res.writeHead(500);
                            return res.end('Error loading script.js');
                        }

                        res.writeHead(200, { 'Content-Type': 'application/javascript' });
                        res.end(scriptData);
                    });
                }
            })
            .catch(err => {
                res.writeHead(500);
                console.log(err);
                res.end(`Error making API request: ${err.message}`);
            });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(8000, () => {
    console.log('Server running on port 8000');
});
