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

## 3. Our Custom Error Class

### 3.1 Basic Info

The main frustration with errors is that there is no one way to handle errors. There are many structures and patterns that do emerge, and one of them is to define your own error class. The reason for this is that you would want to respond with some particular status code or message depending on what the error is. There are many different status codes that would need to use. For example, we could send a 401 status code telling the user that they are unauthorized to access a page

```js
const verifyPassword = (req, res, next) => {
    const {password} = req.query;
    if(password === 'chickens') {
        next();
    }
    // res.send('SORRY WRONG PASSWORD');
    res.status(401);
    throw new Error('Wrong password')
}
```

### 3.2 Custom AppError Class

It would be complicated to write errors over and over again. Let's make a new file called `AppError.js` and define our classes in there

```js
class AppError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}
```

Now we will use our custom class inside of our `verifyPassword()`

```js
const verifyPassword = (req, res, next) => {
    const {password} = req.query;
    if(password === 'chickens') {
        next();
    }
    throw new AppError('Password required', 401);
    // res.send('SORRY WRONG PASSWORD');
    // res.status(401);
    // throw new Error('Wrong password')
}
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img5.jpg?raw=true)

Express automatically tells if the status code is between 400 and 500, and will use this to respond with certain headers. Every error has an associated stack.

```js
app.use((err, req, res, next) => {
    const {status} = err;
    res.status(status).send('ERROR!!!!!!!!!!!')
});
```

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img6.jpg?raw=true)

The problem is not all errors have their own status codes. If we go to `/error`, we are not throwing an app error, but rather a syntax error


![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img7.jpg?raw=true)

We can give the status a default value and it will work 

```js
app.use((err, req, res, next) => {
    const {status} = err;
    res.status(status).send('ERROR!!!!!!!!!!!')
});
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img8.jpg?raw=true)


We can also destructure the error message so that we can send it

```js
app.use((err, req, res, next) => {
    const {status = 500, message = 'Something went wrong'} = err;
    res.status(status).send(message)
});
```

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img9.jpg?raw=true)


### 3.3 Another Example

Let's use a 403 Forbidden response. Difference between that and 401 is that 401 can't tell who the person is, while 403 means we know who you are, but you are denied access

```js
app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin!', 403);
});
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img10.jpg?raw=true)

## 4. Handling Async Errors

### 4.1 Basics

We will be using our Farmstand app when we talked about Express with Mongoose. Note that we are changing the database to `farmStand2` in the mongoose connection URL just so that we don't mess with the original dataset

There are many things that could go wrong in our Farmstand app, like blank forms, invalid ID's, etc. But remember that all of this is async. Let's import our `AppError.js` and create our error middleware

```js
app.use((err, req, res, next) => {
    const {status = 500, message = 'Something went wrong'} = err;
    res.status(status).send(message)
});
```

In our product creation route, let's add a new AppError handler and test it out

```js
app.get('/products/new', (req, res) => {
    throw new AppError('NOT ALLOWED', 401)
    // res.render('products/new', {categories})
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img11.jpg?raw=true)

In our `app.get('/products/:id')`, if we are looking for a product that does not exist, then we would get this

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img12.jpg?raw=true)

Mongoose will not throw an error if a product does not exist. In that case, we can throw our own simple error

```js
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }
    res.render('products/show', {product});
});
```

### 4.2 Side Problems

There's a problem with this though. Look what happens when we try to find a product that doesn't exist:

```
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
(node:9056) UnhandledPromiseRejectionWarning: Error: Product not found
    at C:\Users\BRIAN\Desktop\Web-Dev-Bootcamp-2020\42-Express-Error-Handling\AsyncErrors\index.js:53:15
```

We get this in our console but we are forever stuck in a loop trying to reach the error page. With how async functions work with Express, we would have to pass the `AppError` into `next()`

```js
app.get('/products/:id', async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        next(new AppError('Product not found', 404));
    }
    res.render('products/show', {product});
});
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/42-Express-Error-Handling/42-Express-Error-Handling/img-for-notes/img13.jpg?raw=true)


But then in our console, we are getting an error from EJS

```
Cannot read property 'name' of null
```

We just need to return `next` (or do if/else) so that we don't get anything in the console, because the `res.render()` executes no matter what happens,

```js
app.get('/products/:id', async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }
    res.render('products/show', {product});
});
```