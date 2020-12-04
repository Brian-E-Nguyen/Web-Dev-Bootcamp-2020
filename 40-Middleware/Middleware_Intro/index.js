const express = require('express');
const app = express();
const morgan = require('morgan');
const portNumber = 3000;

// app.use(morgan('common'));
app.use((req, res, next) => {
    console.log(req.method.toUpperCase(), req.path);
    next();
});

// const addDate = 


// app.use((req, res, next) => {
//     console.log('THIS IS MY FIRST MIDDLEWARE');
//     return next();
//     console.log('THIS IS MY FIRST MIDDLEWARE - AFTER CALLING NEXT()');
// });

// app.use((req, res, next) => {
//     console.log('THIS IS MY SECOND MIDDLEWARE');
//     return next();
// });

app.get('/', (req, res) => {
    res.send('Home!');
});

app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF');
});

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});