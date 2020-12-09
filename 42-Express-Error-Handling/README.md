# Section 42: Handling Errors in Express Apps

## 1. Express' Built-In Error Handler

### 1.1 Built-In Error Handler Info

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img1.jpg?raw=true)

We've imported our `index.js` from section 40: Middleware so we can makes some changes to it in this section. When we talk about errors in Express, there are different kinds of groups. A lot of the times, the errors will come as a result of incomplete data, bad connection with DB's or API's, etc. The apps that we create will often interact with external sources, which could lead to errors that you don't anticipate. These errors can also be caused by the user as well, such as when they don't fill out a form correctly

In our `index.js`, let's make a new route called `/error`

```js
app.get('/error', (req,res) => {
    chicken.fly();
});
```

In this case, `chicken` does not exist. Let's see what happens when we go to `/error`

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img2.jpg?raw=true)

Remember that we got a response. It happens to be an HTML response of the stacktrace with HTML tags and a 500 Internal Server Error. Note that we didn't specify that we wanted to respond with these aspects. What we are encountering is the default Express error handling 

### 1.2 Throwing Our Own Errors

We can throw our own errors in Express. Let's take a look at our `verifyPassword` function and throw a new error inside of it

```js
const verifyPassword = (req, res, next) => {
    const {password} = req.query;
    if(password === 'chickens') {
        next();
    }
    // res.send('SORRY WRONG PASSWORD');
    throw new Error('Wrong password')
}
```

Now let's go to `/secret` and see what happens 

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img3.jpg?raw=true)

## 2. Defining Custom Error Handlers

### 2.1 Custom Error Handlers Basics

Link to the error handling docs
- https://expressjs.com/en/guide/error-handling.html

Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: `(err, req, res, next)`. For example:

```js
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

You define error-handling middleware last, after other `app.use()`

### 2.2 Our Own Custom Error Handler

So underneath the very last `app.use()` function in our `index.js`, we will put this:

```js
app.use((err, req, res, next) => {
    console.log('***********************************')
    console.log('**************ERROR****************')
    console.log('***********************************')
});
```

When we go to a route that does _NOT_ throw an error, we do not get the output in the console. Let's see what happens when we do go to a route that DOES throw an error, like the `/error` route that we set up earlier

```
App running on port 3000
GET /error
***********************************
**************ERROR****************
***********************************
```

We no longer get the 500 Status Code or an HTML page, but we do instead get this outputted to our console. Let's add a status code in it

```js
app.use((err, req, res, next) => {
    console.log('***********************************')
    console.log('**************ERROR****************')
    console.log('***********************************')
    res.status(500).send('OH BOY, WE GOT AN ERROR!!!!!!')
});
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img4.jpg?raw=true)

### 2.2 Using next()

If we still want to rely on the built-in express handing, we would just put `next()`. When we handle errors, we MUST pass something inside of it. Let's pass in `err`, but before we do that, let's see what `err` looks like when we `console.log()` it

```js
app.use((err, req, res, next) => {
    console.log('***********************************')
    console.log('**************ERROR****************')
    console.log('***********************************')
    // res.status(500).send('OH BOY, WE GOT AN ERROR!!!!!!')
    // next(err);
    console.log(err);
});
```

```
***********************************
**************ERROR****************
***********************************
Error: Wrong password
    at verifyPassword (C:\Users\BRIAN\Desktop\Web-Dev-Bootcamp-2020\42-Express-Error-Handling\index.js:49:11)
    at Layer.handle [as handle_request] (C:\Users\BRIAN\Desktop\Web-Dev-Bootcamp-2020\42-Express-Error-Handling\node_modules\express\lib\router\layer.js:95:5)
...
```

We would get the stacktrace of it. Now let's actually pass in `err` into `next(err)`, where it will pass it on to the next error handling middleware