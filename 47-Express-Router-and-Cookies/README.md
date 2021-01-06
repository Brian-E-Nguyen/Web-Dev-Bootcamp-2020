# Section 47: Express Router & Cookies

This section will be dealing with Express Router and cookies, which are actually completely different topics, but they're small enough to be combined into this section

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img1.jpg?raw=true)

## 1. Express Router Info

Express comes with a different way of writing our routes. Here's what a simple `index.js` looks like

```js
const express = require('express');
const app = express();
const portNumber = 3000;

// app.get();

app.listen(portNumber, () => {
    console.log('Serving app on localhost:3000')
})
```

However, when we have a large app, there will be a lot of routes and it will be too much to fit in one file. Express comes with _Express Router_, and it creates a new `router` object. The `router` object is an isolated instance of middleware and routes. We can break up our routes in separate files or group them in ways where we can reduce duplication

For example, we have these routes for animal shelters

```
/shelters
POST /shelters
/shelters/:id
/shelters/:id/edit

/dogs
POST /dogs
/dogs/:id

/posts/:id/comments/commentId
```

We have a lot of nested routes, but with Express Router, we can group routes together and put them in a separate file, and make it so we don't have to write `/shelter` over and over. Let's start with making a folder called _routes_, and in it, we will make a `shelters.js` file. We will require Express inside of the file, and we will extract the `Router` class from it. Then we will create our routes and export them

```js
const express = require('express');
const router = express.Router();

router.get('/shelters', (req, res) => {
    res.send('ALL SHELTERS')
});

router.post('/shelters', (req, res) => {
    res.send('CREATING SHELTER')
});

router.get('/shelters/:id', (req, res) => {
    res.send('VIEWING ONE SHELTER')
});

router.get('/shelters/:id/edit', (req, res) => {
    res.send('EDITING SHELTERS')
});

module.exports = router;
```

Now in our `index.js`, we can require that file

```js
// app.js
const shelterRoutes = require('./routes/shelters');
```

Then we specify our routes. The way we do this is by using a this format

```js
app.use('/shelter', router);
```

The `/shelter` serves as a prefix for all of our routes that we have predefined in that router. So instead, in our `shelters.js`, we can remove the word 'shelter' in our paths

```js
// shelter.js

router.get('/', (req, res) => {
    res.send('ALL SHELTERS')
});

router.post('/', (req, res) => {
    res.send('CREATING SHELTER')
});

router.get('/:id', (req, res) => {
    res.send('VIEWING ONE SHELTER')
});

router.get('/:id/edit', (req, res) => {
    res.send('EDITING SHELTERS')
});
```

This is a better option because if we needed to change the path names, we can do so within `index.js`, in one place, so that we don't have to go through every single path and modifying them. The routes will still work as well

```js
app.use('/breeder', shelterRoutes);

// NOTE: the existing paths are not modified
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img2.jpg?raw=true)

Let's do a dog route file as another example

```js
// dogs.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('ALL DOGS')
});

router.get('/:id', (req, res) => {
    res.send('VIEWING ONE DOG')
});

router.get('/:id/edit', (req, res) => {
    res.send('EDITING ONE DOG')
});

module.exports = router;
```

```js
// index.js
const dogRoutes = require('./routes/dogs');

app.use('/dogs', shelterRoutes);
```

## 2. Express Router & Middleware

### 2.1 Creating the Middlware

When we set up our router, the actual router object, we can assign or add on our specific routes, like GET, POST, DELETE, etc, just like we do to the `app`. But we can also add in our own middleware, just like we do to the `app` itself. We can set up our own middleware that will only apply to particular routes in our `router` object.

Let's create a new file called `admin.js` in our _routes_ folder

```JS
// admin.js
const express = require('express');
const router = express.Router();

router.get('/topsecret', (req, res) => {
    res.send('THIS IS TOP SECRET');
});

router.get('/deleteeverything', (req, res) => {
    res.send('OK DELETED IT ALL');
});

module.exports = router;
```

Now we will set up our middleware in our `index.js`. Not that this is not real AuthN

```js
// index.js

const adminRoutes = require('./routes/admin');
...
app.use((req, res, next) => {
    if (req.query.isAdmin) {
        next();
    }
    res.send('NOT AN ADMIN')
});

app.use('/admin', adminRoutes);
```

Let's comment out the middleware first to see if our routes are working

```js
// index.js

const adminRoutes = require('./routes/admin');
...
// app.use((req, res, next) => {
//     if (req.query.isAdmin) {
//         next();
//     }
//     res.send('NOT AN ADMIN')
// });

app.use('/admin', adminRoutes);
```

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img3.jpg?raw=true)

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img4.jpg?raw=true)

Now if we add the middleware back in, we see this

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img5.jpg?raw=true)

### 2.2 Improving Our Middleware

Our middleware works now. And if we were to add `?isAdmin=true` at the end of the URL, then we get so have access to admin routes. The problem is that if we were to go to any route, then the middleware will execute every time, which always displays 'NOT AN ADMIN'. Rather than defining a middleware in `index.js`, we could write a standalone function and pass them into each route, but an even better option is to move that middleware in our `admin.js` and use `router.use()` instead of `app.use()`

```js
// router.js
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (req.query.isAdmin) {
        next();
    }
    res.send('NOT AN ADMIN')
});

router.get('/topsecret', (req, res) => {
    res.send('THIS IS TOP SECRET');
});

...
```

This is saying that all routes inside of `admin.js` will use this router. Now we are able to go to routes that aren't admin ones. When we do go to an admin route, then the middleware will prevent us

## 3. Introducing Cookies

**Cookies** are little bits of information that are stored in a user's web browser when browsing a particular website. Once a cookie is sent, a user's browser will send the cookie on every subsequent request to the site. Cookies allow use to make HTTP stateful. Basically, cookies are used as an identifier for a specific user

If we were to go to the dev tools and to the _Application_ tab, there's a section under _Storage_ where we have access to the _Cookies_ tab

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img6.jpg?raw=true)

If you go to most big websites, there will be more cookies that will track your information

## 4. Sending Cookies

We're going to see how we can use Express to set a cookie and then also pass, parse, or retrieve cookies. Let's work in a new folder called _CookiesDemo_ and create a new  `index.js` file. Remember to install Express inside of that folder

```JS
// index.js

const express = require('express');
const app = express();

app.get('/greet', (req, res) => {
    res.send('HEY THERE!!!!!!!!')
});

app.listen(3000, () => {
    console.log('SERVING!!!!!!')
});
```

So far no cookies are involved. Let's set up a route that involves cookies. Both `res` and `req` have a method called `.cookie()`. 

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img7.jpg?raw=true)


```js
const express = require('express');
const app = express();
...
app.get('/setname', (req, res) => {
    res.cookie('name', 'stevie chicks')
});
```

What we're doing is we are setting the name and sending it back as part of the response, but that's not the response itself and rather only part of it. Let's add a `res.send()`

```js
app.get('/setname', (req, res) => {
    res.cookie('name', 'stevie chicks')
    res.send('OK SENT YOU A COOKIE')
});
```

Now when we go the `/setname` route, we get our cookie

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img8.jpg?raw=true)

When we visit different parts of our app, the browser will save that cookie so that it will keep track of who we are. If we test this out on Postman, it can also show us the cookies

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img9.jpg?raw=true)

We can also send more than 1 cookie as well

```js
app.get('/setname', (req, res) => {
    res.cookie('name', 'stevie chicks');
    res.cookie('animal', 'shrimp');
    res.send('OK SENT YOU A COOKIE')
});
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/47-Express-Router-and-Cookies/47-Express-Router-and-Cookies/img-for-notes/img10.jpg?raw=true)