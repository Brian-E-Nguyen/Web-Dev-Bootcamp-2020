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

![img77](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img7.jpg?raw=true)

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