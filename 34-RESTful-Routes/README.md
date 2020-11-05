# 34. Defining RESTful Routes

## 1. GET vs. POST Requests

Below are the differences between a **GET** request and a **POST** request. Note that these are rules that you *don't have to* follow, but you *should* follow them

### 1.1 GET

- used to retrieve info
- data is sent via query string
- info is plainly visible in the URL!
- limited amount of data can be sent (URL's are 2048 characters)

In our HTML form, it would look something like this:

```html
<form action="/tacos" method="get">
    <input type="text" name="meat" id="">
    <input type="number" name="qty" id="">
    <button type="submit">Submit</button>
</form>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img1.jpg?raw=true)

When we submit this form, we are taken to a new URL that looks like this:

```
file:///C:/tacos?meat=tofu&qty=3
```

### 1.2 POST

- used to post data to the server
- used to write / create / update
- data is sent via request body, not a query string
- can send any sort of data (JSON!)

We will now create the same form but this time the method will be POST

```html
<form action="/tacos" method="post">
    <input type="text" name="meat" id="">
    <input type="number" name="qty" id="">
    <button type="submit">Submit</button>
</form>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img2.jpg?raw=true)

When we click submit, we get this page:

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img3.jpg?raw=true)

It shows this because we didn't get any response back and we don't see any query string. For now that you have to trust that it's part of the response body.

## 2. Defining Express POST Routes

### 2.1 Setting Up Our App

We will create a new folder called *REST_Demo* and run `npm init -y` as well as `npm i express`, and then create a new file called `index.js`

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;

app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

app.listen(portNumber, () => {
    console.log(`LISTENING ON PORT ${portNumber}`);
});
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img4.jpg?raw=true)

Now that we made a basic GET request, let's make a POST request. We do that with `app.post()`

```js
app.post('/tacos', (req, res) => {
    res.send('POST /tacos response')
});
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img5.jpg?raw=true)

### 2.2 Updating Routes

In our `getpost.html` file, let's update our routes so that we can run them with Express

```html
<form action="http://localhost:3000/tacos" method="get">
    <input type="text" name="meat" id="">
    <input type="number" name="qty" id="">
    <button type="submit">Submit</button>
</form>
<h2>POST</h2>
<form action="http://localhost:3000/tacos" method="POST">
    <input type="text" name="meat" id="">
    <input type="number" name="qty" id="">
    <button type="submit">Submit</button>
</form>
```

### 2.3 Testing Our Requests

Let's make a GET request to test it out

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img6.jpg?raw=true)

It works, not let's test out the POST request

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img7.jpg?raw=true)

### 2.4 Final Codes

#### 2.4.1 index.js

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;

app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

app.post('/tacos', (req, res) => {
    res.send('POST /tacos response')
});

app.listen(portNumber, () => {
    console.log(`LISTENING ON PORT ${portNumber}`);
});
```

#### 2.4.2 getpost.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GET and POST</title>
</head>
<body>
    <h1>GET and POST Requests</h1>
    <h2>GET</h2>
    <form action="http://localhost:3000/tacos" method="get">
        <input type="text" name="meat" id="">
        <input type="number" name="qty" id="">
        <button type="submit">Submit</button>
    </form>
    <h2>POST</h2>
    <form action="http://localhost:3000/tacos" method="POST">
        <input type="text" name="meat" id="">
        <input type="number" name="qty" id="">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
```

## 3. Parsing the Request Body

### 3.2 How to Parse the Request Body

So now that we have a basic POST request, let's extract or let's view the data from the request body and do something with it. In Express, there's an easy way to access that data. Just like we have query-string data, it is automatically parsed. `req` includes `req.body` so that we can see the contents

```js
app.post('/tacos', (req, res) => {
    console.log(req.body);
    res.send('POST /tacos response');
});
```

However, when we `console.log(req.body)` we get undefined. According to the `req.body` docs, it is undefined by default, and is populated when you use body-parsing middleware such as `express.json()` or `express.urlencoded()`. This is because **we can send data in many different forms**, which means we can parse them differently

We will use this code

```js
app.use(express.urlencoded({ extended: true}));
```

Remember that `app.use()` runs on whatever request we get

Now when we send a POST request, we get this:

```
$ nodemon index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
LISTENING ON PORT 3000
{ meat: 'beyond meat', qty: '10' }
```

Let's change the POST request to make it more clear

```js
app.post('/tacos', (req, res) => {
    const {meat, qty} = req.body;
    res.send(`OK, here are your ${qty} ${meat} tacos`);
})
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img8.jpg?raw=true)

### 3.2 Quick Fix

Hopefully it's clear that we're not parsing JSON data in the request body. We have to tell Express to anticipate it.

```js
app.use(express.json());
```

## 4. Intro to REST

### 4.1 What is REST?

**Representational State Transfer (REST)** is an "architectural style for distributed hypermedia systems." It's basically a set of guidelines for how a client + server should communicate and perform CRUD operations on a given resource.

The main idea of REST is treating data on the server-side as resources that can be CRUDed. The most common way of approaching REST is in formatting the URLs and the HTTP verbs in your application

### 4.2 REST examples

```
GET /gists
GET /gists/{gist_id}
```

```
POST /gists/{gist_id}
```

```
PATCH /gists/{gist_id}
```

```
DELETE /gists/{gist_id}
```

A lot of these have the same endpoints but with different verbs. The verbs are what controls the operations

## 5. RESTful Comments Overview

We will now create our own "comments" DB with different routes. Below will be the pattern that we will follow

```
GET /comments - list all comments
POST /comment - Create a new comment
GET /comments/:id - Get one comment (using ID)
PATCH /comments/:id - Update one comment
DELETE /comments/:id - Delete one comment
```

## 6. RESTful Comments Index

### 6.1 Setting Up Our Files

We will now install EJS into the *REST_Demo*. We don't need to import it but what we need to do is set the view engine

```js
app.set('view engine', 'ejs');
```

We will then make our *views* directory inside of the *REST_Demo* directory and include the statement to run the server in absolute paths

```js
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
```

We'll create our new route that will display all comments. We don't have any comments, so we'll hardcode a fake DB inside of our `index.js`.

```js
const comments = [
    {
        username: 'Todd',
        comment: 'lol'
    },
    {
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        username: 'Chef Ramsay',
        comment: 'Where\'s the lamb sauce?'
    },
]
```

### 6.2 Making Our GET Request

Our get request will look like this:

```js
app.get('/comments', (req, res) => {
    res.render('comments/index');
});
```

then we'll create a new EJS file called `index.ejs` inside of a new directory called *comments*

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments Index</title>
</head>
<body>
    <h1>Comments</h1>
</body>
</html>
```

Let's start the server and go to the `/comments` path to make sure it's working

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img9.jpg?raw=true)

### 6.3 Rendering Comments

Now we will pass in the comments in `res.render()` and we'll change our `index.ejs` to display the comments

```js
app.get('/comments', (req, res) => {
    res.render('comments/index', {comments});
});
```

```html
<ul>
    <% for(let c of comments) { %> 
        <li><%=c.comment%> - <b><%=c.username%></b> </li>
    <%}%>
</ul>
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img10.jpg?raw=true)

### 6.4 Final Codes

#### 6.4.1 index.js

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const comments = [
    {
        username: 'Todd',
        comment: 'lol'
    },
    {
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        username: 'Chef Ramsay',
        comment: 'Where\'s the lamb sauce?'
    },
]

app.get('/comments', (req, res) => {
    res.render('comments/index', {comments});
});

app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

app.post('/tacos', (req, res) => {
    const {meat, qty} = req.body;
    res.send(`OK, here are your ${qty} ${meat} tacos`);
});

app.listen(portNumber, () => {
    console.log(`LISTENING ON PORT ${portNumber}`);
});
```

#### 6.4.2 index.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments Index</title>
</head>
<body>
    <h1>Comments</h1>
    <ul>
        <% for(let c of comments) { %> 
            <li><%=c.comment%> - <b><%=c.username%></b> </li>
        <%}%>
    </ul>
</body>
</html>
```

## 7. RESTful Comments New

We need two routes for this section to

1. serve the form for making comments
2. make the POST request

### 7.1 Form

We will create a new route with the code below and create a `new.ejs` file

```js
app.get('/comments/new', (req, res) => {
    res.render('comments/new')
});
```

Inside of the `new.ejs` file, we will have a form where the user can make a new comment

```html
<h1>Make a new comment</h1>
<form action="/comments" method="post">
    <section>
        <label for="username">Enter username</label>
        <input type="text" name="username" placeholder="Username" id="username">
    </section>
    <section>
        <label for="comment">Comment Text</label>
        <br>
        <textarea id="comment" cols="30" rows="10"></textarea>
    </section>
    <button>Submit</button>
</form>
```

### 7.2 Making the POST Request

Now we'll make a POST request inside of our `index.js`, which will look like this:

```js
app.post('/comments', (req, res) => {
    console.log(req.body);
    res.send('IT WORKED');
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img11.jpg?raw=true)

We get this page when we fill out the form, and this what our console would look like:

```
$ nodemon index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
LISTENING ON PORT 3000
{ username: 'brina', comment: 'ojietrwpf' }
```

### 7.3 Extracting Our Data

Let's extract the username and comment so we can use them to add to the `comments` list

```js
app.post('/comments', (req, res) => {
    const {username, comment}= req.body;
    comments.push({username, comment})
    res.send('IT WORKED');
});
```

We'll fill out the form now, and then make a GET request to `/comments` to see if it worked

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img12.jpg?raw=true)

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img13.jpg?raw=true)

### 7.4 Final Codes

#### 7.4.1 index.js

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const comments = [
    {
        username: 'Todd',
        comment: 'lol'
    },
    {
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        username: 'Chef Ramsay',
        comment: 'Where\'s the lamb sauce?'
    },
]

app.get('/comments', (req, res) => {
    res.render('comments/index', {comments});
});

app.get('/comments/new', (req, res) => {
    res.render('comments/new')
});

app.post('/comments', (req, res) => {
    const {username, comment}= req.body;
    comments.push({username, comment})
    res.send('IT WORKED');
});

app.get('/tacos', (req, res) => {
    res.send('GET /tacos response');
});

app.post('/tacos', (req, res) => {
    const {meat, qty} = req.body;
    res.send(`OK, here are your ${qty} ${meat} tacos`);
});

app.listen(portNumber, () => {
    console.log(`LISTENING ON PORT ${portNumber}`);
});
```

#### 7.4.1 new.js

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Comment</title>
</head>
<body>
    <h1>Make a new comment</h1>
    <form action="/comments" method="post">
        <section>
            <label for="username">Enter username</label>
            <input type="text" name="username" placeholder="Username" id="username">
        </section>
        <section>
            <label for="comment">Comment Text</label>
            <br>
            <textarea name="comment" id="comment" cols="30" rows="10"></textarea>
        </section>
        <button>Submit</button>
    </form>
</body>
</html>
```