# Section 32: Creating Servers With Express

## 1. Intro to Express

Express is a "fast, unopinionated, minimalist web framework for Node.js". It helps us build web apps and get servers up and running. It's just an NPM package which comes with a bunch of methods and optional plugins that we can use to build web applications and API's.

A few lectures back, this slide was shown how we can make requests

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img1.jpg?raw=true)

Express will help us with the piece on the right: the systems connecting to Google, which then connects to their database. We're listening to incoming requests, their `q`. Then, we build a response and send that back to the client.

Express helps us:

- Start up a server to listen for requests
- Parse incoming requests
    - turns text into objects, etc.
- Match those requests to particular routes
- Craft our http response and associated content
    - status code, headers, etc.


## 2. Libraries vs. Frameworks

When you use a **library,** you are in charge! You control the flow of the application code, and you decide when to use the library. 
- It's typically something that you can integrate into your code at any point
- Libraries like the ASCII art or text-color changer, you can put them anywhere you want

With **frameworks,** that control is inverted.  The framework is in charge, and you are merely a participant! The framework tells you where to plug in the code.
- You are writing the code how the framework tells you. You have to follow along their structure (name of files, what you put in those files)
- You're trading off your freedom for speed of development

## 3. Our Very First Express App

The goal in this section is to get a server up and running. We will make a new directory called "FirstApp" and we will create a `package.json` file in it with `npm init -y`. The `-y` will skip all of the manual specifications when creating the file. 

```
$ npm init -y
Wrote to C:\Users\BRIAN\Desktop\Web-Dev-Bootcamp-2020\32-Creating-Servers-with-Express\FirstApp\package.json:

{
  "name": "FirstApp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

To install express, use `npm i express`. We will then create an `index.js` file and then require express in it.

```js
// index.js
const express = require('express');
const app = express();
console.dir(app); // to make sure we imported the frameworks correctly
```

Running this file will display the many different functions that Express comes with

```
$ node index.js
[Function: app] EventEmitter {
  _events: [Object: null prototype] { mount: [Function: onmount] },
  _eventsCount: 1,
  _maxListeners: undefined,
  setMaxListeners: [Function: setMaxListeners],
  getMaxListeners: [Function: getMaxListeners],
  emit: [Function: emit],
  addListener: [Function: addListener],
  on: [Function: addListener],
  prependListener: [Function: prependListener],
  once: [Function: once],
  prependOnceListener: [Function: prependOnceListener],
  removeListener: [Function: removeListener],
  off: [Function: removeListener],
  removeAllListeners: [Function: removeAllListeners],
  listeners: [Function: listeners],
  rawListeners: [Function: rawListeners],
  listenerCount: [Function: listenerCount],
  eventNames: [Function: eventNames],
  init: [Function: init],
  ...
```

The main thing that we would need to do to get a server going is just start listening. There is a method called `listen()`. It requires a port that it will listen on.

```js
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
```

```
$ node index.js
LISTENING ON PORT 3000
```

The app is sitting there and listnening for a request. It doesn't end. This is only served locally on your own machine. We would have to go to a place called `localhost`, which is a reference to your machine.

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img2.jpg?raw=true)

When we go to `http://localhost:3000/`, we get this message. Now it may seem like an error, because it actually is, but if we were to go to a different port, we would get this:

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img3.jpg?raw=true)

This is a message saying that there is nothing at all. The previous one says that there is no response, but a server is there.

The next thing we're gonna do is use the `use()` method:

```js
// index.js
const express = require('express');
const app = express();

// new piece of code
app.use(() => {
    console.log('WE GOT A NEW REQUEST')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
```

What this does is that when we have an incoming request, the callback will execute. Doesn't matter where the request is, what it is, just that all requests will execute the callback.

When we run this file and go to `localhost:3000`, we would get this in our terminal:

```
$ node index.js
LISTENING ON PORT 3000
WE GOT A NEW REQUEST
```

If we hit refresh, it shows up a second time

```
$ node index.js
LISTENING ON PORT 3000
WE GOT A NEW REQUEST
WE GOT A NEW REQUEST
```

## 4. The Request & Response Objects

### 4.1 Intro

We can past in two different objects in the `use()` method: the request and the response. These are objects made by express and passed into this callback

```js
app.use((req, res) => {
    console.log('WE GOT A NEW REQUEST')
    console.dir(req)
})
```

An HTTP request is not a JS object, it's just text. JS is converting that request into a JS object.

When we run this code, we can see the request object that we sent. One of the things that we can see is the path name

```
 baseUrl: '',
  originalUrl: '/',
  _parsedUrl: Url {
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: '/',
    path: '/',
    href: '/',
    _raw: '/'
  },
```

If we were to change the request path to `localhost:3000/dogs` for example, we would get this:

```
  baseUrl: '',
  originalUrl: '/dogs',
  _parsedUrl: Url {
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: null,
    pathname: '/dogs',
    path: '/dogs',
    href: '/dogs',
    _raw: '/dogs'
  },
```

### 4.2 res.send()

`res.send()` can send back responses in various forms, like text, JSON, etc. 

```js
// index.js
const express = require('express');
const app = express();

app.use((req, res) => {
    console.log('WE GOT A NEW REQUEST')
    // new piece of code
    res.send('HELLO, WE GOT YOUR REQUEST! THIS IS A RESPONSE');
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
```

When we go to localhost:3000, we get this message:

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img4.jpg?raw=true)

If we were to change the header of the response, say JSON, then Express will automatically format the content-type for us

```js
// index.js
const express = require('express');
const app = express();

app.use((req, res) => {
    console.log('WE GOT A NEW REQUEST');
    // new piece of code
    res.send({color: 'red'});
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img6.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img6.jpg?raw=true)

You can even pass in HTML to `res.send()` as well

```js
// index.js
const express = require('express');
const app = express();

app.use((req, res) => {
    console.log('WE GOT A NEW REQUEST')
    // new piece of code
    res.send('<h1>This is my webpage!</h1>');
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
```

![img77](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img7.jpg?raw=true)
