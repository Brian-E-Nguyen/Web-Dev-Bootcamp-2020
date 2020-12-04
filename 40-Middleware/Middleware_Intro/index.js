const express = require('express');
const app = express();
const morgan = require('morgan');
const portNumber = 3000;

morgan('tiny')

app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.send('Home!');
});

app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF');
});

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});