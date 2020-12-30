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