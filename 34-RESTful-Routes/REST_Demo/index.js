// index.js
const express = require('express');
const app = express();
const portNumber = 3000;

app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

app.post('/tacos', (req, res) => {
    res.send('POST /tacos response')
});

app.listen(portNumber, () => {
    console.log(`LISTENING ON PORT ${portNumber}`);
});