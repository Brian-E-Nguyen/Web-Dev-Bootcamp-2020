# Section 42: Handling Errors in Express Apps

## 1. Express' Built-In Error Handler

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

