// index.js
const express = require('express');
const app = express();
const portNumber = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

app.post('/tacos', (req, res) => {
    const {meat, qty} = req.body;
    res.send(`OK, here are your ${qty} ${meat} tacos`);
});

app.listen(portNumber, () => {
    console.log(`LISTENING ON PORT ${portNumber}`);
});