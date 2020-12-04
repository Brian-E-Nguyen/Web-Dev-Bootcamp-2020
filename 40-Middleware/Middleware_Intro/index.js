const express = require('express');
const app = express();
const morgan = require('morgan');
const portNumber = 3000;

// app.use(morgan('common'));
app.use((req, res, next) => {
    console.log(req.method.toUpperCase(), req.path);
    next();
});

app.use('/dogs', (req, res, next) => {
    console.log('I LOVE DOGS!!');
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

const verifyPassword = (req, res, next) => {
    const {password} = req.query;
    if(password === 'chickens') {
        next();
    }
    res.send('SORRY WRONG PASSWORD');
}

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET: sometimes I wear headphones in public so I dont have to talk to people')
});

app.use((req, res) => {
    res.status(404).send('NOT FOUND')
});

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});