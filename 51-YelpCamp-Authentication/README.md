# Section 51 - YelpCamp: Adding In Authentication

## 1. Introduction to Passport

We will work on integrating authentication and our user model into our YelpCamp app. This will take a while, because as we've learned with authentication, it's fairly complex, but not too bad. We've got to set up plenty of routes, forms, middleware, etc. Previously, we've used _Bcrypt_ to set up our authentication, but we're not doing that here; instead, we'll be using a tool called _Passport_, which is a popular library to add authentication into Node apps. What's different about this is that it lists different strategies or ways to log someone in.

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img1.jpg?raw=true)

**Passport Docs**

- http://www.passportjs.org/

For YelpCamp, we will just do a basic `passport-local` login that only requires username and password. It's relatively easy, but you'll see that we have to make a decent amount of changes to a couple of files, as well as making some new files. There's a specialized libary called _Passport-Local Mongoose_ that makes everything easier

- https://github.com/jaredhanson/passport-local
- https://github.com/saintedlama/passport-local-mongoose

`> npm install passport mongoose passport-local-mongoose`

## 2. Creating Our User Model

We will create our user model where we will store username and password. A new thing that we will do is store email so we could use it at some point. Let's call this file `user.js`

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
```

The reason why we don't specify a username and a password in our `UserSchema` is that the `UserSchema.plugin(passportLocalMongoose)` will do that for us

## 3. Configuring Passport

Now we will configure our app to use Passport in our `app.js` file. The docs says make sure to use session before `passport.session()`

```js
// app.js
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

...

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

Let's create a route where we fake the creation of a user

```js
app.get('/fakeUser', async(req, res) => {
    const user = new User({email: 'b@gmail.com', username: 'brianNNNN'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});
```

The `User.register()` method takes in an instance of a user and the password. It will then hash the password. Let's go to the `/fakeUser` route and see what we get

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img2.jpg?raw=true)

## 4. Register Form

We will make a new form for our user routes. Let's first create a new `users.js` file in our _routes_ folder

```js
// users.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

module.exports = router;
```

Then we will make a new folder called _users_ inside of our _routes_ directory. Inside of the _users_ folder, we will create a _register.ejs_ file with just an `<h1>` tag to test it out

Next we will require the file in our `app.js`. Note that we decided to chnage the name of our variable routes by appending 'Routes' so that it's more clear

```js
const usersRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

app.use('/', usersRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
```

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img3.jpg?raw=true)

Now that the route works, let's add in our form for `register.ejs`

```html
<% layout('layouts/boilerplate') %> 
<h1>Register</h1>
<form action="/register" method="POST" class="validated-form" novalidate>
    <div class="mb-3">
        <label class="form-label" for="username">Username</label>
        <input class="form-control" type="text" name="username" id="username" required>
        <div class="valid-feedback">
            <p>Looks good!</p>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input class="form-control" type="email" name="email" id="email" required>
        <div class="valid-feedback">
            <p>Looks good!</p>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input class="form-control" type="password" name="password" id="password" required>
        <div class="valid-feedback">
            <p>Looks good!</p>
        </div>
    </div>
    <button class="btn btn-success">Register</button>
</form>
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img4.jpg?raw=true)

Let's add in a POST route so we can test out sending our data

```js
// users.js
router.post('/register', async(req, res) => {
    res.send(req.body);
});
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img6.jpg?raw=true)

## 5. Register Route Logic

### 5.1 Basic Stuff

Let's edit our register POST route so that it can actually save a new user. Remember that we don't need to pass in the password in the User object. The `register()` function will do that for us, and it will hash the password

```js
router.post('/register', async(req, res) => {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash('success','Welcome to YelpCamp!');
    res.redirect('/campgrounds');
});
```

Let's test this out to see if it works

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img7.jpg?raw=true)

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img8.jpg?raw=true)

And we get this in our console:

```
{
  _id: 6014644ae18c19056071bdb6,
  email: 'tim@gmail.com',
  username: 'tim',
  salt: '2b618460a1e26e794555d10d71aa9371ca323f6af3fb972bdd6501b9a8ee5539',
  hash: '6d7975090b7e18aa87be4bc13c045292d1d111eadcf38a017ca7fed7b6a48db87aa7998500938f4c53a2234b607c5acab09649046ce0518b14bef4334523fd83eec82bbd0cc0d4cef4aa578c7fa95b9321efbb7923cac616e8d12145998ccd3c1828a0cca2124960372b8bf75d348254bbe0f89cb7b4fd4bdadf7074f84308093fbab8456738b805bbf6e6a79733707dad5862d2e09ac5daddbcbbcac83afcc0d9890687252e2934e15907a99ae01ff90402b509c19031f3de3472b19ad1177107cb9bda19493504b48d4238440283fb7feea679017e900dd9d7c84af883a91ada4f00ec537ce1d00f5f948be2cf40b52823870c272d7a6d0e4318c0f376c185f12d88b3a4ac9f04614da71e1579e3b1fe721db64a027a2086926e114a314b262b1ac4a55ecce9a2d50f6a9892339fe0e5d01da8c46f54cef47ffa590ea54e444b5c69b31228dec922d02ce14301733619cbe93d2358b23ba23a29a2f1ef45997ddb9a2383ae57c45f87bf6b9aa0cbf7de9d00a626d1bc57d4ec2810235a9137dab6c06bbc6dcb5201f05aa91a1c140e316003968ede4159b57d8d7a3dc869f8e6adb1bcc1d52f6a0763cb2243052a43c6c9d0bfc4beb1cdbd206b84fa1122ebe2cfa84dab160db41941859f184928b396a9584d3ccc1394050e6b1443cc8976c2a6192bec994cfed6032f3ea0e6fe1688ba735290d0f98f48d63da2ef3ce35a',
  __v: 0
}
```

### 5.2 Improving Register Error UX

There are things that can go wrong with our async functions, so we would need a function that would catch these problems. We already have a `catchAsync()` function in our _utils_ folder, so let's use that in our POST route

```js
router.post('/register', catchAsync(async(req, res) => {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash('success','Welcome to YelpCamp!');
    res.redirect('/campgrounds');
}));
```

But with our `catchAsync()` function, it's mostly a default error handler. This is what we will get if we register a user with a username that already exists

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img9.jpg?raw=true)

This is not good user experience to redirect the user to another page and show this weird message. Instead, it'll be better if we flash. We will add our own try/catch block inside of this route

```js
router.post('/register', catchAsync(async(req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success','Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    }
    catch(err) {
        req.flash('error', err.message);
        res.redirect('register')
    }
}));
```

Now let's try registering a user that already exists

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img10.jpg?raw=true)

## 6. Login Routes

We will make two routes for login: serving our form and the logic of logging a user in. 

### 6.1 Login Form

Let's work with the form first. We will create a new file called `login.ejs` and take some of the form code from `register.ejs` and modify it a little bit. In this form, we don't need the email field because we only collect it when the user is registering; the user just needs to log in with their username and password

```html
<% layout('layouts/boilerplate') %> 
<h1>Login</h1>
<form action="/login" method="POST" class="validated-form" novalidate>
    <div class="mb-3">
        <label class="form-label" for="username">Username</label>
        <input class="form-control" type="text" name="username" id="username" required>
        <div class="valid-feedback">
            <p>Looks good!</p>
        </div>
    </div>
    <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input class="form-control" type="password" name="password" id="password" required>
        <div class="valid-feedback">
            <p>Looks good!</p>
        </div>
    </div>
    <button class="btn btn-success">Login</button>
</form>
```

### 6.2 Route Logic

Passport gives us a middleware called `passport.authenticate()`, which we pass in the strategy that we will use

```js
const passport = require('passport');

...

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
});
```

Let's try logging in with invalid credentials, then with valid ones

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img11.jpg?raw=true)

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/51-YelpCamp-Authentication/51-YelpCamp-Authentication/img-for-notes/img12.jpg?raw=true)
