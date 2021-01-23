const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MONGOOSE CONNECTION OPEN')
}).catch(err => {
    console.log('OH NO MONGO CONNECTION ERROR!!!!!!!!!!!!!!!!!!!!');
    console.log(err)
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('THIS IS A HOME PAGE');
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {
    const {password, username} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hashedPassword
    });
    await user.save();
    res.redirect('/')
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if(validPassword) {
        res.send('WELCOME')
    }
    else {
        res.send('TRY AGAIN')
    }
});

app.get('/secret', (req, res) => {
    res.send('THIS IS SECRET. YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN!');
})

app.listen(3000, () => {
    console.log('SERVING YOUR APP!')
});