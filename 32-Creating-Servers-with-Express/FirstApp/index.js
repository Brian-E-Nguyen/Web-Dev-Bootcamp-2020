// index.js
const express = require('express');
const app = express();

// app.use((req, res) => {
//     console.log('WE GOT A NEW REQUEST')
//     res.send('<h1>This is my webpage!</h1>');
// })

app.get('/', (req, res) => {
    res.send('This is the homepage!')
});

// subreddit
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`
        <h1>
            Browsing the ${subreddit} subreddit!
        </h1>
    `);
});

// subreddit -> post
app.get('/r/:subreddit/:postID', (req, res) => {
    const { subreddit, postID } = req.params;
    res.send(`
        <h1>
            Viewing post ID: ${postID} on the ${subreddit} subreddit!
        </h1>
    `);
});

// /cats => 'meow'
app.get('/cats', (req, res) => {
    res.send('MEOW')
});
// /dogs => 'woof'
app.get('/dogs', (req, res) => {
    res.send('WOOF');
});

app.get('/search', (req, res) => {
    const { q } = req.query;
    res.send(`<h1>Search results for: ${q}</h1>`);
})

// Generic route
app.get('*', (req,res) => {
    res.send('I DO NOT KNOW THAT PATH')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
});