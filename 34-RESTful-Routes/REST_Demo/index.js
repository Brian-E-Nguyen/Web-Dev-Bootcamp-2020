// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override')


app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

let comments = [
    {
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol'
    },
    {
        id: uuidv4(),
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        id: uuidv4(),
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
    comments.push({username, comment, id: uuidv4()});
    res.redirect('/comments');
});

app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', {comment});
});

app.patch('/comments/:id', (req, res) => {
    // Get the ID in the request
    const {id} = req.params;
    // Extract the comment in the request
    const newCommentText = req.body.comment;
    // Use the extracted ID to find the comment associated with it
    const foundComment = comments.find(c => c.id === id);
    // Update the old comment with the new one
    foundComment.comment = newCommentText;
    res.redirect('/comments');
});

app.get('/comments/:id/edit', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', {comment});
});

app.delete('/comments/:id', (req, res) => {
    // Get the ID in the request
    const {id} = req.params;
    // filter() returns a list with specified filters
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
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