# Section 40 - Middleware: The Key To Express

## 1. Intro to Express Middleware

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img1.jpg?raw=true)

Middleware is the building blocks of Express. They run when an request enters Express and stops when it sends a response

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img2.jpg?raw=true)

From the official docs 

***Middleware*** functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named `next`.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.

## 2. Using Morgan - Logging Middleware

### 2.1 Initializing Everything

The Morgan logger helps us log HTTP requests to our terminal. Let's create a new directory called _Middleware_Intro_ and install Express and Morgan

1. `npm init -y`
2. `npm i morgan express`
3. Create `index.js`

We will add this inside of our `index.js`

```js
const express = require('express');
const app = express();
const portNumber = 3000;

app.get('/', (req, res) => {
    res.send('Home!');
});

app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF');
});

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});
```

### 2.2 app.use()

To use Morgan, we would have to require it and put this code inside:

```js
const morgan = require('morgan');

morgan('tiny')

app.use(() => {
    console.log('AYYYYY')
});
```

`app.use()` allows us to run code on every single request. For example `app.use(express.json());` means to parse every request into JSON format

This is saying no matter what request is being used, 'AYYYYY' will be printed to the console

```
[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
App running on port 3000
AYYYYY
```

This is kindof an example of a middleware because it does run when a request is received, but it does not send requests itself. Note that this code causes the pages to be stuck because we are not sending anything

### 2.3 Using Morgan

Now let's actually use the `morgan` function

```js
const morgan = require('morgan');

app.use(morgan('tiny'));
```

This is what the console would look like if we send a request to the root and `/dogs`

```
App running on port 3000
GET / 304 - - 2.694 ms
GET /dogs 200 9 - 0.442 ms
```

So we have this code right now, but we haven't told express to move on to the next middleware. In the next section, we will define how we can tell express to do so