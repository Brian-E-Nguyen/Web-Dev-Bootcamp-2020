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

## 8. Express Redirects

### 8.1 The Problem

Whenever we make a new comment, it takes us to the POST route, not the actual GET route.

If we were to refresh the page on the POST route, then we get this message

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img14.jpg?raw=true)

This is saying that if we click "Confirm", then we will send another POST request. This is what happens if we do this multiple times and we send a GET request to `/comments`

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img15.jpg?raw=true)

It's because we are currently in the POST request route. Since we kept on refreshing, we are constantly sending POST requests

```js
app.post('/comments', (req, res) => {
    const {username, comment}= req.body;
    comments.push({username, comment})
    res.send('IT WORKED');
});
```

### 8.2 res.redirect()

Instead of rendering something directly in our POST route, we will redirect the user to another view. We will redirect them back to where the comments are

The `res` object has a method called `res.redirect()`. It passes in the parameter of what view we want to go to. It is by default a GET request. Let's now make changes to our POST request

```js
app.post('/comments', (req, res) => {
    const {username, comment}= req.body;
    comments.push({username, comment});
    // new code
    res.redirect('/comments');
});
```

This redirects the user every time the user adds a comment. To tell that this works, open up the dev tools and check the network activity

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img16.jpg?raw=true)

### 8.3 Final Code (index.js)

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
    comments.push({username, comment});
    res.redirect('/comments');
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

## 9. RESTful Comments Show

### 9.1 Coding the Route

We will work with the name *Show* for this section

| Name | Path          | Verb | Purpose                          |
|------|---------------|------|----------------------------------|
| Show | /comments/:id | GET  | Details for one specific comment |

We will get the specific ID of a comment so that we can retrieve and display it. Let's create a GET request in `index.js`

```js
app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === parseInt(id));
    res.render('comments/show', {comment});
});
```

Since we have ID with our users, let's add that into our `comments` table

```js
const comments = [
    {
        id: 1,
        username: 'Todd',
        comment: 'lol'
    },
    {
        id: 2,
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        id: 3,
        username: 'Chef Ramsay',
        comment: 'Where\'s the lamb sauce?'
    },
]
```

Now let's make our `show.ejs` file

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Show</title>
</head>
<body>
    <h1>Comment id: <%= comment.id %> </h1>
    <h2><%=comment.comment%> - <%=comment.username %></h2>
    <a href="/comments">Back to index</a>
</body>
</html>
```

Let's make a get request with comment ID 3. We will get this returned to us

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img17.jpg?raw=true)

### 9.2 Improving the Index Page

In our `index.ejs` file, we will make all comments have their own link tab so when we click on them, we will make a GET request to their own respective `/comments/:id` page

```html
<% for(let c of comments) { %> 
    <li><%=c.comment%> - <b><%=c.username%></b> </li> 
    <a href="/comments/<%= c.id %> ">details</a>
<%}%>
```

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img18.jpg?raw=true)

## 10. The UUID Package

There's a slight problem, which is that if we create a new comment, and then go to that comment's `/comments/:id` route, we get nothing because we have no way of creating a new comment ID.

An efficient solution for this is to get unique ID's in there, to mimic what we would use in an actual DB. This is where the Universally Unique ID UUID package comes in.

### 10.1 Quickstart

We will install and require UUID in our REST_Demo directory 

1. Install

```
npm i uuid
```

2. Create a UUID

```js
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
```

Everytime we call `uuidv4()`, we will get a new unique ID.

Note that the code below is destructuring. The variable before the colon is the official name. We can give it a new name with a variable to the right of the colon

```js
{ v4: uuidv4 }
```

### 10.2 Making Our Changes

Now we can replace our hardcoded ID's in our `comments` table with `uuidv4()`

```js
const comments = [
    {
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol'
    },
    {
        id: uuidv4(),
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        id: uuidv4(),
        username: 'Chef Ramsay',
        comment: 'Where\'s the lamb sauce?'
    },
]
```

Also when we make a new comment, we need to give it a new ID. 

```js
app.post('/comments', (req, res) => {
    const {username, comment}= req.body;
    comments.push({username, comment, id: uuidv4()});
    res.redirect('/comments');
});
```

One other thing that we need to change is this code

```js
app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === parseInt(id));
    res.render('comments/show', {comment});
});
```

We don't need to parse the integer anymore, so now it should look like this:

```js
app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', {comment});
});
```

Let's run our server and test out the UUID

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img19.jpg?raw=true)


### 10.3 Final Code (index.js)

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const comments = [
    {
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol'
    },
    {
        id: uuidv4(),
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        id: uuidv4(),
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
    comments.push({username, comment, id: uuidv4()});
    res.redirect('/comments');
});

app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', {comment});
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

## 11. RESTful Comments Update

### 11.1 Intro

We will be working with *Update* in this section

| Name | Path          | Verb | Purpose                          |
|------|---------------|------|----------------------------------|
| Update | /comments/:id | PATCH  | Updates specific comment on server |

In the case of comments, we only want to update the text of the comment, not the username or ID. We'll provide a form for someone to edit the comment. 

### 11.2 PATCH vs. PUT

In this, we are using a *PATCH* request. It's used to apply partial modifications of a resource. This is different from a *PUT* request, in that

- PUT requests are for updating an **entire** resource
- PATCH requests are for **partially** updating a resource

### 11.3 Making Our PATCH Request

Let's make our `app.patch()` code to test

```js
app.patch('/comments/:id', (req, res) => {
    res.send('UPDATING SOMETHING');
});
```

And now let's make a PATCH request on Postman to test it out

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img20.jpg?raw=true)

How to actually update our comment is to take the comment's ID, find the comment that we currently have, and then update the comment with some payload. We will have this code for testing purposes

```js
app.patch('/comments/:id', (req, res) => {
    const {id} = req.params;
    // const comment = comments.find(c => c.id === id);
    console.log(req.body.comment);
    res.send('ALL GOOD')
});
```

We will then use Postman to test this out. Inside of the body, we will add a key and the value. If done successfuly, the page should render "ALL GOOD"

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img21.jpg?raw=true)

And this is what we would get in the console

```
[nodemon] starting `node index.js`
LISTENING ON PORT 3000
I LOVE U MAN
```

Let's now update our PATCH request with this code

```js
app.patch('/comments/:id', (req, res) => {
    // Get the ID in the request
    const {id} = req.params;
    // Extract the comment in the request
    const newCommentText = req.body.comment;
    // Use the extracted ID to find the comment associated with it
    const foundComment = comments.find(c => c.id === id);
    // Update the old comment with the new one
    foundComment.comment = newCommentText;
    res.redirect('/comments');
});
```

Now that we've got this code, let's go to a `/comment/:id` page and copy the URL. We will go into Postman and send a PATCH request to update the comment. First, make sure to send a GET request to the URL to make sure it's working. Then, change to request to PATCH and change the value of `comment` to something else in the Body. 

Send the PATCH request to make sure that everything is working

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img22.jpg?raw=true)

### 11.4 Final Code (index.js)

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const comments = [
    {
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol'
    },
    {
        id: uuidv4(),
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        id: uuidv4(),
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
    comments.push({username, comment, id: uuidv4()});
    res.redirect('/comments');
});

app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', {comment});
});

app.patch('/comments/:id', (req, res) => {
    // Get the ID in the request
    const {id} = req.params;
    // Extract the comment in the request
    const newCommentText = req.body.comment;
    // Use the extracted ID to find the comment associated with it
    const foundComment = comments.find(c => c.id === id);
    // Update the old comment with the new one
    foundComment.comment = newCommentText;
    res.redirect('/comments');
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

## 12. Express Method Override

### 12.1 Intro

| Name | Path          | Verb | Purpose                          |
|------|---------------|------|----------------------------------|
| Edit | /comments/:id/edit | GET  | Form to edit specific comment |

We will make a form in this section to help us easily update our comments; however, the problem with HTML forms is that they can only send GET our POST requests. Fortunately we can fake it. 

### 12.2 Making Our Request

Let's first make a route to serve a form. It will be a GET request

```js
app.get('/comments/:id/edit', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', {comment});
});
```

And then we'll make a new file called `edit.ejs`

```html
 <form action="/comments/<%=comment.id%>/edit">
    <!-- Prefills textarea with original comment -->
    <textarea name="comment" id="" cols="30" rows="10">
        <%= comment.comment %> 
    </textarea>
    <button>Save</button>
</form>
```

### 12.3 method-override Package

Take a look at the `action` attribute in the form. Although we defined a custom route, we still need to implement the PATCH request. Express comess with a package called `method-override`, so we need to install it in our *RESTful_Demo* package.

We will have to use this code to override our requests

```js
var express = require('express')
var methodOverride = require('method-override')
var app = express()

app.use(methodOverride('_method')
```

### 12.4 Finishing Up The Form

At the end of our form's action, we will add a query string and define it as a PATCH request. In our form's method, we still need to put "POST" in it

```html
<h1>Edit</h1>
<form method="POST" action="/comments/<%=comment.id%>?_method=PATCH">
    <!-- Prefills textarea with original comment -->
    <textarea name="comment" id="" cols="30" rows="10">
        <%= comment.comment %> 
    </textarea>
    <button>Save</button>
</form>
```

![img23](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img23.jpg?raw=true)

![img24](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img24.jpg?raw=true)

![img25](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img25.jpg?raw=true)

### 12.5 UX Improvement

In our `show.ejs` file we will add this code to the bottom so that we can easily go to the edit page

```html
<a href="/comments/<%=comment.id%>/edit">Edit Comment</a>
```

### 12.6 Final Codes

#### 12.6.1 index.js

```js
// index.js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override')


app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const comments = [
    {
        id: uuidv4(),
        username: 'Todd',
        comment: 'lol'
    },
    {
        id: uuidv4(),
        username: 'Sk8rboi',
        comment: 'He said to ya "l8er boi"'
    },
    {
        id: uuidv4(),
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
    comments.push({username, comment, id: uuidv4()});
    res.redirect('/comments');
});

app.get('/comments/:id', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', {comment});
});

app.patch('/comments/:id', (req, res) => {
    // Get the ID in the request
    const {id} = req.params;
    // Extract the comment in the request
    const newCommentText = req.body.comment;
    // Use the extracted ID to find the comment associated with it
    const foundComment = comments.find(c => c.id === id);
    // Update the old comment with the new one
    foundComment.comment = newCommentText;
    res.redirect('/comments');
});

app.get('/comments/:id/edit', (req, res) => {
    const {id} = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', {comment});
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

#### 12.6.2 edit.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit</title>
</head>
<body>
    <h1>Edit</h1>
    <form method="POST" action="/comments/<%=comment.id%>?_method=PATCH">
        <!-- Prefills textarea with original comment -->
        <textarea name="comment" id="" cols="30" rows="10">
            <%= comment.comment %> 
        </textarea>
        <button>Save</button>
    </form>
</body>
</html>
```

## 13. RESTful Comments Delete

### 13.1 Intro

| Name | Path          | Verb | Purpose                          |
|------|---------------|------|----------------------------------|
| Destroy | /comments/:id | DELETE  | Deletes specific comment |

In this section, we will set up a route that deletes a specific comment. Just like the previous section, we can't use the DELETE metehod with a form, but we can fake it, or we could use JS on the client-side.

### 13.2 Making Our Delete Request

When we delete something, there's typically not a view for it. There's usually just a delete button. Let's start with a basic route

```js
app.delete('/comments/:id', (req, res) => {
    // Get the ID in the request
    const {id} = req.params;
    // filter() returns a list with specified filters
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');
});
```

It may seem weird to not just delete the comment from the array, but it's actually good practice to make a copy of the array. With that, we have to remove the `const` declaration of our `comments` array and replace it with `let`

```js
let comments = [...];
```

### 13.3 Making Our Delete Button

Let's put our delete button on `show.ejs`. It will be nested inside of a `<form>` tag

```html
<form action="/comments/<%=comment.id%>?_method=DELETE" method="post">
    <button>Delete</button>
</form>
```

Now let's try deleting a comment

![img26](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img26.jpg?raw=true)

![img27](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img27.jpg?raw=true)

The comment is now deleted