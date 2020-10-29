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

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img7.jpg?raw=true)

## 5. Express Routing Basics

Routing refers to taking incoming requests and a path that is requested, and matching that to some code in some response. For example, a path can be `localhost:3000/dogs`. 

Express has the `.get()` method, and we will use that to specify what response we get when going to certain routes

**NOTE:** for this example, comment out `app.use()` because no matter what request we send, it will always execute that one.

We will have a path `/cats` for example in our `index.js` file

```js
// index.js
const express = require('express');
const app = express();

// app.use((req, res) => {
//     console.log('WE GOT A NEW REQUEST')
//     res.send('<h1>This is my webpage!</h1>');
// })

// /cats => 'meow'
app.get('/cats', (req, res) => {
    console.log('CAT REQUEST');
})
// /dogs => 'woof'
// '/' 

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
```

When we run `index.js` we will get this and go to `localhost:3000/cats`:

```
$ node index.js
LISTENING ON PORT 3000
CAT REQUEST
```

Using the forward slash `/` considers the path a root path.



### 5.2 Generic Responses

There are sometimes when we would make a request to a path that doesn't exist. We would need a generic response for this. To do this, we would use the `*` character as a route in `app.get()`

```js
app.get('*', (req,res) => {
    res.send('I DO NOT KNOW THAT PATH')
})
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img8.jpg?raw=true)


### 5.3 Final Code

```js
// index.js
const express = require('express');
const app = express();

// app.use((req, res) => {
//     console.log('WE GOT A NEW REQUEST')
//     res.send('<h1>This is my webpage!</h1>');
// })

app.get('/', (req, res) => {
    res.send('This is the homepage!')
});

// /cats => 'meow'
app.get('/cats', (req, res) => {
    res.send('MEOW')
});
// /dogs => 'woof'
app.get('/dogs', (req, res) => {
    res.send('WOOF');
});

app.get('*', (req,res) => {
    res.send('I DO NOT KNOW THAT PATH')
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
});
```

## 6. Express Path Parameters

### 6.1 Intro

Often we would want to define patterns for our routes. For example, the URL "https://www.reddit.com/r/SquaredCircle/" has the "SquaredCircle" route, which will show wrestling content. If you go to another one, like r/pics, it will show you pictures. The point is there are patterns. Now there are 1000's of subreddits created, and we wouldn't manually create them with our code. It'll be impossible. Instead, we define a generic pattern

```js
// r/<SOMETHING HERE>
```

`<SOMETHING HERE>` would be a variable that we pass into. To do this, we would follow this pattern:

```js
app.get('/r/:subreddit', (req, res) => {
    res.send('THIS IS A SUBREDDIT')
});
```

This will match the actual string `subreddit` and anything that follows this pattern. If we run `index.js` and go to any path with this pattern, we would get this:

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img9.jpg?raw=true)

### 6.2 `params`

Express has a property in the request object called `params` that shows us the parameters of the path

```js
app.get('/r/:subreddit', (req, res) => {
    console.log(req.params);
    res.send('THIS IS A SUBREDDIT');
});
```

```
$ node index.js
LISTENING ON PORT 3000
{ subreddit: 'cats' }
```

We can utilize `params` to store the subreddit name in a variable

```js
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`
        <h1>
            Browsing the ${subreddit} subreddit!
        </h1>
    `);
});
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img10.jpg?raw=true)

### 6.3 Multiple Parameters

We are not limited to one parameter. For example, we can have `https://www.reddit.com/r/SquaredCircle/top/`, where `top` is an additional parameter.

To do this in our code, we would append different variables to a route like this:

```js
app.get('/r/:subreddit/:postID', (req, res) => {
    const { subreddit, postID } = req.params;
    res.send(`
        <h1>
            Viewing post ID: ${postID} on the ${subreddit} subreddit!
        </h1>
    `);
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img11.jpg?raw=true)

### 6.4 Final Code

```js
// index.js
const express = require('express');
const app = express();

// app.use((req, res) => {
//     console.log('WE GOT A NEW REQUEST')
//     res.send('<h1>This is my webpage!</h1>');
// })

app.get('/', (req, res) => {
    res.send('This is the homepage!')
});

// subreddit
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`
        <h1>
            Browsing the ${subreddit} subreddit!
        </h1>
    `);
});

// subreddit -> post
app.get('/r/:subreddit/:postID', (req, res) => {
    const { subreddit, postID } = req.params;
    res.send(`
        <h1>
            Viewing post ID: ${postID} on the ${subreddit} subreddit!
        </h1>
    `);
});

// /cats => 'meow'
app.get('/cats', (req, res) => {
    res.send('MEOW')
});
// /dogs => 'woof'
app.get('/dogs', (req, res) => {
    res.send('WOOF');
});

// Generic route
app.get('*', (req,res) => {
    res.send('I DO NOT KNOW THAT PATH')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
});
```

## 7. Working With Query Strings

### 7.1 Basics

Often, applications are set up to expect query strings. For example, if we were to sort a post's comments by new, we would see this url:

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img12.jpg?raw=true)

We see that the query string has the word 'new' passed in to sort.

If we define some route, we do not add anything to this path here in terms of matching a query string. 

```js
app.get('/r/:subreddit/:postID', (req, res) => {
    const { subreddit, postID } = req.params;
    res.send(`
        <h1>
            Viewing post ID: ${postID} on the ${subreddit} subreddit!
        </h1>
    `);
});
```

Instead, the request object has a property called `query`, and in that property, we will find key-value pairs made or based upon the query string.

```js
app.get('/search', (req, res) => {
    res.send('HIIIII!!!!')
    console.log(req.query);
})
```

```
$ node index.js
LISTENING ON PORT 3000
{}
```

Our query string is empty right now, but if we add a query string, which in Postman we can do through params, the query object contains the queries that we pass in

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img13.jpg?raw=true)

```
$ node index.js
LISTENING ON PORT 3000
{ q: 'dogs', color: 'blue' }
```

We can use the `req.query` object as a variable

```js
app.get('/search', (req, res) => {
    const { q } = req.query;
    res.send(`<h1>Search results for: ${q}</h1>`);
});
```
![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img14.jpg?raw=true)

### 7.2 Final Code

```js
// index.js
const express = require('express');
const app = express();

// app.use((req, res) => {
//     console.log('WE GOT A NEW REQUEST')
//     res.send('<h1>This is my webpage!</h1>');
// })

app.get('/', (req, res) => {
    res.send('This is the homepage!')
});

// subreddit
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.send(`
        <h1>
            Browsing the ${subreddit} subreddit!
        </h1>
    `);
});

// subreddit -> post
app.get('/r/:subreddit/:postID', (req, res) => {
    const { subreddit, postID } = req.params;
    res.send(`
        <h1>
            Viewing post ID: ${postID} on the ${subreddit} subreddit!
        </h1>
    `);
});

// /cats => 'meow'
app.get('/cats', (req, res) => {
    res.send('MEOW')
});
// /dogs => 'woof'
app.get('/dogs', (req, res) => {
    res.send('WOOF');
});

app.get('/search', (req, res) => {
    const { q } = req.query;
    res.send(`<h1>Search results for: ${q}</h1>`);
})

// Generic route
app.get('*', (req,res) => {
    res.send('I DO NOT KNOW THAT PATH')
})

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
});
```

## 8. Auto-Restart With Nodemon

One thing that's really annoying with node is having to manually restart our server every time there are changes in our code. To prevent this, there's a package called `nodemon`. Generally we would install this globally.

`npm i -g nodemon`

To check you have nodemon, use `nodemon -v`.

To use nodemon, use `nodemon <file>` instead of the regular `node <file>`

```
$ nodemon index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
LISTENING ON PORT 3000
```

Every time we save our `index.js` file, the server automatically restarts

```
$ nodemon index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
LISTENING ON PORT 3000
[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
LISTENING ON PORT 3000
```