const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express');
const flash = require('connect-flash');
const portNumber = 3000;
const methodOverride = require('method-override');

const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false};
app.use(session(sessionOptions));
app.use(flash());

const Product = require('./models/product');
const Farm = require('./models/farm');
mongoose.connect('mongodb://localhost:27017/FlashDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

/*
--------------
FARM ROUTES
--------------
*/

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', {farms, messages: req.flash('success')})
});

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
});

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id)
        .populate('products');;
    res.render('farms/show', {farm})
});

app.post('/farms', async(req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash('success', 'Successfully made a farm')
    res.redirect('/farms');
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});