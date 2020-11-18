const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;

mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONOG CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/dog', (req, res) => {
    res.send('WOOF!');
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});