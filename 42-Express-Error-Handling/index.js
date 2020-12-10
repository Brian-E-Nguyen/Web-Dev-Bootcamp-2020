const express = require('express');
const app = express();
const morgan = require('morgan');
const portNumber = 3000;

const AppError = require('./AppError');

// app.use(morgan('common'));
app.use((req, res, next) => {
    console.log(req.method.toUpperCase(), req.path);
    next();
});

app.get('/error', (req,res) => {
    chicken.fly();
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
    throw new AppError('Password required', 401);
    // res.send('SORRY WRONG PASSWORD');
    // res.status(401);
    // throw new Error('Wrong password')
}

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET: sometimes I wear headphones in public so I dont have to talk to people')
});

app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin!', 403);
});

app.use((req, res) => {
    res.status(404).send('NOT FOUND')
});

// app.use((err, req, res, next) => {
//     console.log('***********************************')
//     console.log('**************ERROR****************')
//     console.log('***********************************')
//     // res.status(500).send('OH BOY, WE GOT AN ERROR!!!!!!')
//     next(err);
//     // console.log(err);
// });

app.use((err, req, res, next) => {
    const {status = 500, message = 'Something went wrong'} = err;
    res.status(status).send(message)
});

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});