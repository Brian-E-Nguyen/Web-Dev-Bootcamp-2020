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

## 3. Defining Our Own Middleware

There are lots of situation to write and use our own middleware

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img3.jpg?raw=true)

The `next` refers to the next middleware. So when you call `next()`, it will call the next matching middleware or route handler. Let's add this in our `index.js`

```js
app.use(morgan('common'));
app.use((req, res, next) => {
    console.log('THIS IS MY FIRST MIDDLEWARE');
    next();
});
```

Let's see what happens when we make a request by going to one of our pages

```
[nodemon] starting `node index.js`
App running on port 3000
THIS IS MY FIRST MIDDLEWARE
::1 - - [04/Dec/2020:19:06:12 +0000] "GET /dogs HTTP/1.1" 304 -
```

That's really all there is to defining middleware, or at least, the pattern of it. Now that does not mean that code that comes after `next()` executes automatically. It will eventually

```JS
app.use(morgan('common'));
app.use((req, res, next) => {
    console.log('THIS IS MY FIRST MIDDLEWARE');
    next();
    console.log('THIS IS MY FIRST MIDDLEWARE - AFTER CALLING NEXT()');
});

app.use((req, res, next) => {
    console.log('THIS IS MY SECOND MIDDLEWARE');
    next();
});
```

```
App running on port 3000
THIS IS MY FIRST MIDDLEWARE
THIS IS MY SECOND MIDDLEWARE
THIS IS MY FIRST MIDDLEWARE - AFTER CALLING NEXT()
::1 - - [04/Dec/2020:19:23:27 +0000] "GET /dogs HTTP/1.1" 304 -
```

If we wanted to be extra safe with our code, we would do `return next();` This makes sure that no code executes after `next()`. As you can see in the code, the `console.log()` is grayed out

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img4.jpg?raw=true)

## 4. More Middleware Practice

With middleware, we can access and modify information from the request. The `req` object will have credentials and a signifier that someone is indeed authenticating. We can write middleware if a token is on that request. One other thing we can do is add `requestTime` to the request object

```js
var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}
```

We will see request decorating a lot. Let's make out own example

```js
app.use((req, res, next) => {
    console.log(req.method.toUpperCase());
    next();
});
```

```
App running on port 3000
GET
```

So right here, we are close to recreating what morgan does. Let's add a little bit more to it

```js
app.use((req, res, next) => {
    console.log(req.method.toUpperCase(), req.path);
    next();
});
```

```
App running on port 3000
GET /dogs
```

We can do something mischievous with the requests. We can make every request a GET request for example

```js
app.use((req, res, next) => {
    req.method = 'GET';
    console.log(req.method.toUpperCase(), req.path);
    next();
});
```

## 5. Setting Up A 404 Routes

We've been using `app.use()` just for passing in functions and that's it and it will run for every single incoming request. But we can also pass in a string for a path match

```js
app.use('/dogs', (req, res, next) => {
    console.log('I LOVE DOGS!!');
    next();
});
```

This middleware only runs with on the path of `/dogs`

```
App running on port 3000
GET /dogs
I LOVE DOGS!!
```

The other thing we use `app.use()` for is to define a 404. We have to put this at the very end of our routes, at the bottom of the `index.js`

```JS
app.use((req, res) => {
    res.send('NOT FOUND')
});
```

This will only run if we never sent back anything before, if we never ended the cycle by matching any of the routes

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img5.jpg?raw=true)

Another thing that we can do is use `res.status()`

```js
app.use((req, res) => {
    res.status(404).res.send('NOT FOUND')
});
```

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img6.jpg?raw=true)

## 6. Password Middleware Demo (NOT REAL AuthN)

**NOTE:** I'm only gonna paste in the code because the stuff covered in here is pretty much useless

```JS
app.use((req, res, next) => {
    const {password} = req.query;
    if(password === 'chickens') {
        next();
    }
    res.send('SORRY WRONG PASSWORD');
})

app.get('/secret', (req, res) => {
    res.send('MY SECRET: sometimes I wear headphones in public so I dont have to talk to people')
});
```

## 7. Protecting Specific Routes

When we define `app.get()`, we define a path and we can have multiple callback functions that behave like middleware

```js
const verifyPassword = (req, res, next) => {
    const {password} = req.query;
    if(password === 'chickens') {
        next();
    }
    res.send('SORRY WRONG PASSWORD');
}

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET: sometimes I wear headphones in public so I dont have to talk to people')
});
```

`verifyPassword` will run first, and if it calls `next()`, then `app.get('/secret')` will run

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img7.jpg?raw=true)

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img8.jpg?raw=true)

Just remember this ain't real AuthN!