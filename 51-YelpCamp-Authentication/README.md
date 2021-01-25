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