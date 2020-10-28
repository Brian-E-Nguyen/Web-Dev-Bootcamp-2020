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

// /cats => 'meow'
app.get('/cats', (req, res) => {
    res.send('MEOW')
});
// /dogs => 'woof'
app.get('/dogs', (req, res) => {
    res.send('WOOF');
});

app.get('*', (req,res) => {
    res.send('I DO NOT KNOW THAT PATH')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
});