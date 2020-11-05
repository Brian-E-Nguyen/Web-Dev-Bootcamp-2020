// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const comments = [
    {
        username: 'Todd',
        comment: 'lol'
    },
    {
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        username: 'Chef Ramsay',
        comment: 'Where\'s the lamb sauce?'
    },
]

app.get('/comments', (req, res) => {
    res.render('comments/index', {comments});
});

app.get('/comments/new', (req, res) => {
    res.render('comments/new')
});

app.post('/comments', (req, res) => {
    const {username, comment}= req.body;
    comments.push({username, comment})
    res.send('IT WORKED');
});

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