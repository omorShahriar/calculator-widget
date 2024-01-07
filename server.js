const http = require('http');
const fs = require('fs');
const axios = require('axios');
const url = require('url');
const asyncHandler = require('express-async-handler')
var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/', function (req, res, next) {
    res.json({ msg: 'Hello World' })
})

app.get('/script.js', asyncHandler(async function (req, res, next) {
    const apiKey = req.query.key;
    if (!apiKey) {
        res.writeHead(400);
        res.end('API key is missing');
    }

    const apiUrl = `https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/nysbip-customer-valid?API-key=${apiKey}`;

    try {
        const { data } = await axios.get(apiUrl);
        if (!!data) {
            console.log('Error: API returned false')
            res.status(401).json({ msg: 'Error: API returned false' });
        } else {
            fs.readFile('./script.js', (err, scriptData) => {
                if (err) {
                    return res.status(500).send('Error loading script.js');
                }
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.end(scriptData);
            });
        }
    } catch (err) {
        res.status(500).send(`Error making API request: ${err.message}`);
    }

}))



app.listen(8000, function () {
    console.log('CORS-enabled web server listening on port 8000')
})


// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);
//     if (parsedUrl.pathname === '/') {
//         res.end('Hello World');
//     }
//     else if (parsedUrl.pathname === '/script.js') {
//         const apiKey = parsedUrl.query.key;
//         if (!apiKey) {
//             res.writeHead(400);
//             return res.end('API key is missing');
//         }
//         const apiUrl = `https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/nysbip-customer-valid?API-key=${apiKey}`;

//         axios.get(apiUrl)
//             .then(apiRes => {
//                 const result = apiRes.data;
//                 console.log(apiUrl);

//                 if (result === false) {
//                     res.writeHead(400);
//                     res.end('Error: API returned false');
//                 } else {
//                     fs.readFile('./script.js', (err, scriptData) => {
//                         if (err) {
//                             res.writeHead(500);
//                             return res.end('Error loading script.js');
//                         }

//                         res.writeHead(200, { 'Content-Type': 'application/javascript' });
//                         res.end(scriptData);
//                     });
//                 }
//             })
//             .catch(err => {
//                 res.writeHead(500);
//                 console.log(err);
//                 res.end(`Error making API request: ${err.message}`);
//             });
//     } else {
//         res.writeHead(404);
//         res.end();
//     }
// });

// server.listen(8000, () => {
//     console.log('Server running on port 8000');
// });
