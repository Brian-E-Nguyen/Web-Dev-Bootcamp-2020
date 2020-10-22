# Section 28: AJAX and API's

## 1. Intro to AJAX

AJAX is an acronym with the following terms

- ***A***synchronous
- ***J***avaScript
- ***A***nd
- ***X***ML

This refers to a concept of loading or sending information on a given website or application. Like on reddit, you get new posts as you constantly scroll. Requests are being made to reddit to load more posts.

Instead of retrieving HTML, CSS, and JS, we would be receiving data, like in JSON or XML.

The idea of AJAX is creating apps where using JS, you can load, fetch, save, or send data

## 2. Intro to API's

***A***pplication ***P***rogramming ***I***nterface (API) is a very broad term where a software interacts with another piece of software. When people talk about API's, they usually talk about web API's. Some companies expose their endpoints, which will respond with code for consumers. It's like a portal into a different application. They occur over HTTP.

For example, on this website called [Cryptonator](https://www.cryptonator.com/api/), it gives us an endpoint for us to use, and it returns us JSON value

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img1.jpg?raw=true)

It's an interface not for humans, but rather web pages.

Some of them are free, some of them are not. It costs money for companies to receive requests

There are a bunch of different API's, like weather, Spotify song trends, Twitter etc. Long story short, there are many API's and we will be focusing on Web API's

## 3. WTF is JSON?

XML was once commonly used years ago, but now ***J***ava***S***cript ***O***bject ***N***otation (JSON) is being used more often than XML. Instead of AJAX, we use __AJAJ__. Whenever people say "AJAX", they most likely are referring to JSON now

```json
{
    "name": "Brian",
    "year": 2019,
    "hobbies": [
        ...
    ]
}
```

As you can see here, we have key-value pairs. All of the keys must be in double-quoted strings

JSON supports these values:
- object
- array
- string
- number
- "true"
- "false"
- "null"

Some values in JavaScript are not valid in JSON, like `undefined`.

### 3.1 Parsing and Working with JSON

Let's say we have a string of JSON data that we have retrieved somewhere

```js
//THIS IS A STRING OF JSON (NOT AN OBJECT)
const data = `{"ticker":{"base":"BTC","target":"USD","price":"11288.49813464","volume":"91769.69699773","change":"-46.29462447"},"timestamp":1596510482,"success":true,"error":""}`
```

In order to format this string into actual JSON object, we would need to do this:

```js
// THIS IS A JS OBJECT
const parsedData = JSON.parse(data);
```

### 3.2 Static Methods

`JSON.parse(text[, reviver])`

> Parses the string `text` as JSON

`JSON.stringify(value[, replacer[, space]])`

> Returns a JSON string corresponding to the specified value

## 4. Using Postman

**NOTE:** I am skipping this section because I already know how to use it

## 5. Query Strings & Headers

- URL: **/search/shows?q=:query**
- Example: http://api.tvmaze.com/search/shows?q=girls

Everytime you see `:query` on an API documentation, that means it is a variable. `?q` is a query string and it's a way of providing additional information to a request. The reason why we bring this up because a lot of websites use query strings

In Postman, you can easily edit the key-value pairs, or you can edit them manually in the URL

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img2.jpg?raw=true)

Note that not all API's are the same. Some of them may require headers

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img3.jpg?raw=true)

If we were to request https://icanhazdadjoke.com, it will return HTML by default. If we want to change what we get returned, we need to specify the header

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img4.jpg?raw=true)

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img5.jpg?raw=true)

## 6. Making XHR's

**NOTE:** I am skipping this section because XHR is not ideal

## 7. The Fetch API

The Fetch API:

- is a newer way of making requets via JS
- supports promises while XHR did not
- is not supported by Internet Explorer

The simplest way to retrieve data is by using the `fetch()` function. Example:

`fetch('https://api.cryptonator.com/api/ticker/btc-usd')`

This will then return a promise

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img6.jpg?raw=true)

Of course, if we request an endpoint that doesn't exist, the request will be rejected

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img7.jpg?raw=true)

With the `fetch()` method, we can chain them with `.then()`

```js
fetch('https://api.cryptonator.com/api/ticker/btc-usd')
    .then(res => {
        console.log("RESPONSE", res);
    })
    .catch(e => {
        console.log("OH NO! ERROR!", e)
    })
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img8.jpg?raw=true)

What's kinda annoying about fetch is that it doesn't return data just yet. What happens is that fetch will resolve the promise as soon as it receives the header, so that is when we use a second method called `.json()`. It is used with the *response* variable

```js
fetch('https://api.cryptonator.com/api/ticker/btc-usd')
    .then(res => {
        console.log("RESPONSE, WAITING TO PARSE", res);
        return res.json(); // right here
    })
    .then(data => {
        console.log('DATA PARSED...', data);
        // console.log(data.ticker.price)
    })
    .catch(e => {
        console.log("OH NO! ERROR!", e);
    })
```

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img9.jpg?raw=true)

This is used with a 'promisey' version, but now here's the async version

```js
const fetchBitcoinPrice = async () => {
    try {
        const res = await fetch('https://api.cryptonator.com/api/ticker/btc-usd');
        const data = await res.json();
        console.log(data.ticker.price)
    } catch (e) {
        console.log("SOMETHING WENT WRONG!!!", e)
    }
}
```

## 8. Axios

### 8.1 Intro to Axios

Axios is a library that is built on top of the `fetch()` request. Axios makes everything easier with making API calls.

[Link to the axios GitHub](https://github.com/axios/axios)

To make things easy, we will load the CDN onto our HTML file to access axios

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Axios</title>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

</head>
```

#### 8.1.1 Fetching with .get()

The first one is `.get()`. This returns a promise, but unlike the regular `fetch()` method, it also returns the data as well

```js
axios.get('https://api.cryptonator.com/api/ticker/btc-usd')
```
![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img10.jpg?raw=true)

We can also use `.then()` to chain the methods. We already have the response object fully parsed, so no need to do additional steps

```js
axios.get('https://api.cryptonator.com/api/ticker/btc-usd')
    .then(res => {
        console.log(res.data.ticker.price)
    })
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img11.jpg?raw=true)

... and of course we can use `.catch()`

```js
axios.get('https://api.cryptonator.com/api/ticker/btc-usd')
    .then(res => {
        console.log(res.data.ticker.price)
    })
    .catch(error => {
        console.log('ERROR!!', err)
    })
```

We can also use async/await as well

```js
const fetchBitcoinPrice = async () => {
    try {
        const res = await axios.get('https://api.cryptonator.com/api/ticker/btc-usd')
        console.log(res.data.ticker.price)
    } catch (e) {
        console.log("ERROR!", e)
    }
}
```

#### 8.1.2 Note

Since we used a CDN, we don't have to use 

```js
const axios = require('axios').default;
```

in our examples

### 8.2 Setting Headers with Axios

```js
const getDadJoke = async () => {
    const response = await axios.get('https://icanhazdadjoke.com');
    console.log(response)
}
```

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img12.jpg?raw=true)

With some API's, like the icanhazdadjoke, we need to specify headers to retrieve what data we want. For this example, it is returning HTML, but we want JSON. How can we do that?

The `.get()` method accepts a second parameter that is an object

```js
const getDadJoke = async () => {
    const config = { headers: { Accept: 'application/json' }}
    const response = await axios.get('https://icanhazdadjoke.com', config);
    console.log(response)
}
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/27-AJAX-and-APIs/27-AJAX-and-APIs/img-for-notes/img13.jpg?raw=true)

We can now extract the joke with the response we got

```js
const getDadJoke = async () => {
    const config = { headers: { Accept: 'application/json' }}
    const response = await axios.get('https://icanhazdadjoke.com', config);
    console.log(response.data.joke)
}
```

## 9. TV Show Search App

Refer to the folder *TVShowSearchApp*