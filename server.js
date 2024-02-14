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

app.get(
    "/script.js",
    asyncHandler(async function (req, res, next) {
        const apiKey = req.query.key;
        if (!apiKey) {
            res.writeHead(400);
            res.end("API key is missing");
        }

        const apiUrl = `https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/nysbip-customer-valid?API-key=${apiKey}`;

        try {
            const { data } = await axios.get(apiUrl);
            if (!data) {
                console.log("Error: API returned false");
                res.status(401).json({
                    msg: "Error: API returned false",
                });
            } else {
                fs.readFile(
                    "scripts/calculator-script.js",
                    (err, scriptData) => {
                        if (err) {
                            return res
                                .status(500)
                                .send("Error loading script.js");
                        }
                        res.writeHead(200, {
                            "Content-Type": "text/javascript",
                        });
                        res.end(scriptData);
                    }
                );
            }
        } catch (err) {
            res
                .status(500)
                .send(
                    `Error making API request: ${err.message}`
                );
        }
    })
);

app.get(
    "/esb-roi.js",
    asyncHandler(async function (req, res, next) {
        // const apiKey = req.query.key;
        // if (!apiKey) {
        //     res.writeHead(400);
        //     res.end('API key is missing');
        // }

        // const apiUrl = `https://x8ki-letl-twmt.n7.xano.io/api:oex10dm_/esb-roi-customer-valid?API-key=${apiKey}`

        try {
            // const { data } = await axios.get(apiUrl);
            // if (!data) {
            // 	console.log("Error: API returned false");
            // 	res
            // 		.status(401)
            // 		.json({
            // 			msg: "Error: API returned false",
            // 		});
            // } else {
            fs.readFile(
                "scripts/esb-roi.js",
                (err, scriptData) => {
                    if (err) {
                        return res
                            .status(500)
                            .send("Error loading script.js");
                    }
                    res.writeHead(200, {
                        "Content-Type": "text/javascript",
                    });
                    res.end(scriptData);
                }
            );
            // }
        } catch (err) {
            res
                .status(500)
                .send(
                    `Error making API request: ${err.message}`
                );
        }
    })
);


app.listen(8000, function () {
    console.log('CORS-enabled web server listening on port 8000')
})



