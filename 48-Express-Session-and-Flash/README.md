# Section 48: Express Session & Flash

These will be quick sections focused on "sessions", which will allow us to implement authentication keep people logged in, remember their information, etc. It also goes along with cookies. Then we will talk about how to set up Express Sessions. Lastly, we will integrate Flash messages, which are little popup messages that are sent to the user

## 1. Introduction to Sessions

It's not very practical (or secure) to store a lot of datta client-side using cookies. This is where sessions come in!

**Sessions** are a *server-side* data store that we use to make HTTP stateful. Instead of storing data using cookies, we store the data on the *server-side* and then send the browser a cookie that can be used to retrieve the data. The idea is not to store the data permanently, but rather to persist something from one request to the next to keep track of who's logged in, what's in the person's shopping cart, what's their username, etc.

So why not just use cookies? One thing is that cookies have a maximum size in your browser. Most browsers have a limit on how many cookies are stored are how big the cookie size is. Another thing is that they're not as secured when they are stored

The idea of a session is that we store information on the server-side and then we send a little cookie back to the client that says "here's the key and ID to unlock your session"

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img1.jpg?raw=true)

Here's a diagram to understand how sessions work. *Data store* is not the same as a database. In it, we will store shopping cart info for various users currently on our site, even if they don't have an account or not logged in. So instead of storing shopping cart information that is associated with a user inside of a database, we will have a session with an ID that will be associated with shopping cart information. 

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img2.jpg?raw=true)

The browser then uses that information on subsequent requests

## 2. Express Session

### 2.1 Installing Express Session and Creating index.js

In this video, we will install *express-session*, which is a library. Just like cookies, sessions are not exclusive to Express, but rather universal. Let's create a new folder called _SessionDemo_ where will install Express and *express-session* (sidenote: in the past, *cookie-parser* would need to be installed in older versions, but that's no longer the case). Let's create our `index.js`.

Configuring *express-session* would be its own section. It does matter in production and in terms of security, but for what we need right now, what we need to pass in our function is a secret

```js
const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({secret: 'thisisnotagoodsecret'}));

app.get('/viewcount', (req, res) => {
    res.send('YOU HAVE VIEWED THIS PAGE X TIMES');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});
```

### 2.2 Creating Our Session

So now how does session work? Inside of any route or middleware, inside of the `req` object, we will now have a `session` property available. Let's go to our new route

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img3.jpg?raw=true)

As you can see, we have a cookie called 'connect.sid', which is shortened from Connect Session ID. We receive a cookie that corresponds to some little spot in memory in the session just for me. If we were to delete that cookie and come back to that route, we would receive a new cookie value

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img4.jpg?raw=true)

Below is the comparison of the cookies that was present before and our new one

```
s%3AouocgXt-GvmlOu1a7jJlRncUzeXg5A_9.jZGQhNPEmIBWYs%2B8H4YNxPvZVETFwjhrctIN1i%2BQZb8

s%3ATNcG12JYRQDdr5kKE8UCsbjCSTWZDv5I.m268WweyfaGF8%2B2tlLZAd3ITc0syd6Nbf1W%2Fpafb6fw
```

Let's modify our route so that we can use `req.sessions`

```js
app.get('/viewcount', (req, res) => {
    if(req.session.count) {
        req.session.count += 1;
    }
    else {
        req.session.count = 1;
    }
    res.send(`You have viewed this page ${req.session.count} times`);
});
```

When we `req.session`, we can add on other properties to it. `req.session.count` does not exist in the predefined package, but we are able to add that.

Whenever we refresh the page, our viewcount of that page will increase, but our cookie will stay the same 

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img6.jpg?raw=true)

Note that if you were to go to this route on a different browser, the count resets. Why? Because everything is stored on each separately

## 3. More Express Session

In this section, we will get more practice with Express Sessions and also remove the deprecation warnings in the console. We will modify our middleware with this code so remove the deprecation waranings

```js
app.use(session({secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false}));
```

Now let's make two new routes called `/register` and `/greet`

```js
app.get('/register', (req, res) => {
    const {username = 'Anon'} = req.query;
    req.session.username = username;
    res.redirect('/greet');
});

app.get('/greet', (req, res) => {
    const {username} = req.session;
    res.send(`Welcome back ${username}`);
});
```

`/greet` won't be happy if we go to that route without first going to `/register`; it will just say `undefined`. Let's go to the `/register` route

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img7.jpg?raw=true)

Now let's change the query string so that we have our own custom username

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img8.jpg?raw=true)

The browser now stored the username 'Brian', so every time we go to `/greet`, the page will display our username

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img9.jpg?raw=true)

## 4. Intro to Flash

### 4.1 Basic Information

Next up, we've got a topic that is kind of related to sessions and cookies, or it at least depends on sessions, but it's really just a package. This package is called _connect-flash_. The idea of a flash is basically a place in the session to flash a message to a user, like a success, confirmation, or failure message. It's usually after some action and typically before you redirect somewhere. For example, if we submitted a form and we made a new farm in our farm app, a little message would display that says something likle "Successfully created farm." But when we refresh the page, we want that message to go away. This is where a tool like _connect-flash_ comes in 

### 4.2 Setting Up Our App

Let's import our farm app to work with this and we'll name the new directory _FlashDemo_

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img10.jpg?raw=true)

Now we will install _connect-flash_ with `npm i connect-flash`. Note that _connect-flash_ depends on _express-session_ so we need to install that as well

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express');
const flash = require('connect-flash');
...
const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false};
app.use(session(sessionOptions));
app.use(flash());
...
```

### 4.3 Using req.flash()

Now that we've imported _connect-flash_, all request objects now has a method called `req.flash()`. Let's use this after we have successfully created a farm, which will be inside of our POST request 

```js
app.post('/farms', async(req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    // new code
    req.flash('success', 'Successfully made a farm')
    res.redirect('/farms');
});
```

The first parameter is the key / type of message (we can call this whatever we want), and the second parameter is the actual message. We are actually not going to see this message at all just yet because this is adding information into the session. In order to access it out, we just call `req.flash()` when we're rendering something and then passing the key

```js
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', {farms, messages: req.flash('success')})
});
```

Now we will go into our `index.ejs` and render the success message

```html
<!-- index.ejs -->
<body>
    <%= messages %> 
    <h1>All Farms</h1>
```

Let's try this out when making a new farm.

__AUTHOR NOTE:__ for some reason, I get an error saying that `req.flash()` needs to have sessions in order for it to work. I can't seem to fix this, even though I already have _express-session_ installed

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img11.jpg?raw=true)

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/48-Express-Session-and-Flash/img-for-notes/img12.jpg?raw=true)

## 5. Res.locals & Flash

When we use `req.flash()`, it's annoying that we would have to type out all of this code

```js
res.render('farms/index', {farms, messages: req.flash('success')})
```

It's not bad if it's just on the index, but if we needed this on multiple routes, then it would get tedious. What we can do is set up a middleware. This will allow us to set up a response object in such a way that in every template and view, we will have access to messages. The response object has a message called `res.locals()`, which is an object that contains responses local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any)

```js
app.use((req, res, next) => {
    res.locals.messages = req.flash('success');
    next();
});
```

The success message still works properly after setting up this middleware