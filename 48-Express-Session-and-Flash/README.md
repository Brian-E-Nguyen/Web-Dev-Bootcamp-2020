# Section 48: Express Session & Flash

These will be quick sections focused on "sessions", which will allow us to implement authentication keep people logged in, remember their information, etc. It also goes along with cookies. Then we will talk about how to set up Express Sessions. Lastly, we will integrate Flash messages, which are little popup messages that are sent to the user

## 1. Introduction to Sessions

It's not very practical (or secure) to store a lot of datta client-side using cookies. This is where sessions come in!

**Sessions** are a *server-side* data store that we use to make HTTP stateful. Instead of storing data using cookies, we store the data on the *server-side* and then send the browser a cookie that can be used to retrieve the data. The idea is not to store the data permanently, but rather to persist something from one request to the next to keep track of who's logged in, what's in the person's shopping cart, what's their username, etc.

So why not just use cookies? One thing is that cookies have a maximum size in your browser. Most browsers have a limit on how many cookies are stored are how big the cookie size is. Another thing is that they're not as secured when they are stored

The idea of a session is that we store information on the server-side and then we send a little cookie back to the client that says "here's the key and ID to unlock your session"

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img1.jpg?raw=true)

Here's a diagram to understand how sessions work. *Data store* is not the same as a database. In it, we will store shopping cart info for various users currently on our site, even if they don't have an account or not logged in. So instead of storing shopping cart information that is associated with a user inside of a database, we will have a session with an ID that will be associated with shopping cart information. 

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img2.jpg?raw=true)

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

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img3.jpg?raw=true)

As you can see, we have a cookie called 'connect.sid', which is shortened from Connect Session ID. We receive a cookie that corresponds to some little spot in memory in the session just for me. If we were to delete that cookie and come back to that route, we would receive a new cookie value

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img4.jpg?raw=true)

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

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img6.jpg?raw=true)

Note that if you were to go to this route on a different browser, the count resets. Why? Because everything is stored on each separately