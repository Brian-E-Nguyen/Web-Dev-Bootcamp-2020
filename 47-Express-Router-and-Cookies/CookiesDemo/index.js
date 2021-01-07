const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser('thisismysecret'));

app.get('/greet', (req, res) => {
    const {name = 'anon'} = req.cookies;
    res.send(`Hey there, ${name}`);
});

app.get('/setname', (req, res) => {
    res.cookie('name', 'stevie chicks');
    res.cookie('animal', 'shrimp');
    res.send('OK SENT YOU A COOKIE')
});

app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', {signed: true})
    res.send('OK SIGNED UR COOKIE')
});

app.get('/verifyfruit', (req, res) => {
    console.log(req.signedCookies);
    res.send(req.signedCookies);
});

app.listen(3000, () => {
    console.log('SERVING!!!!!!')
});