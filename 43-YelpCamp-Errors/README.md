# Section 43 - YelpCamp: Errors & Validaiting Data

## 1. Client-Side Form Validations

### 1.1 HTML's `required` Tag

If we were to create a campground without putting any client-side validations, this is what it would look like after we create it:

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img1.jpg?raw=true)

One thing that we can do on the form is to use the native HTML `required` tag on each `<input>` tags

```html
<input class="form-control" type="text" name="campground[title]" id="title" required>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img2.jpg?raw=true)

This works, but it's not very pretty. What if we wanted the text field to highlight red if there's invalid data? We don't have the option to customize this if we use the `required` tag. Also it depends on the browser. It's not centralized across all browsers

### 1.2 Validating With Boostrap

#### 1.2.1 Basics

Bootstrap comes with its own validation helpers. Link to docs:
- https://getbootstrap.com/docs/5.0/forms/validation/

Along with the `required` tag, it uses the pseudo-classes `:invalid` and `:valid`. Look at the first line of code at the bottom. We are using the `novalidate` tag because we are telling the browser to not validate the form yet, and that's so Bootstrap can take over. Unfortunately, we have to use javascript, which we will talk in a moment

```html
<form class="row g-3 needs-validation" novalidate class="validated-form">
  <div class="col-md-4">
    <label for="validationCustom01" class="form-label">First name</label>
    <input type="text" class="form-control" id="validationCustom01" value="Mark" required>
    <div class="valid-feedback">
      Looks good!
    </div>
```

Let's make changes to our `new.js` form by adding `novalidate` at the starting `<form>` tag and `required` to all `<input>` tags

```html
<form action="/campgrounds" method="post" novalidate>
    <div class="mb-3">
        <label class="form-label" for="title">Title</label>
        <input class="form-control" type="text" name="campground[title]" id="title" required>
    </div>

    ...
```

Right now you are still able to create a campground without any validation, but in order for it to work, we need some JS code. We will put this at the very bottom of our `new.js` file in a `<script>` tag

```js
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
```

#### 1.2.2 Validation in Action

Now here's what it would look like when we try to submit a form with invalid data

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img3.jpg?raw=true)

And when we do type in valid data, the textbox turns green

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img4.jpg?raw=true)

We can also provide valid feedback to the user with the class of `.valid-feedback`

```html
<input class="form-control" type="text" name="campground[title]" id="title" required>
    <div class="valid-feedback">
        <p>Looks good!</p>
    </div>

...
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img6.jpg?raw=true)

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img7.jpg?raw=true)


We should also do the exact same thing for our Edit Campground form as well. Let's move our JS code into our boilerplate code so that we don't have to copy it every time

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img8.jpg?raw=true)


## 2. Basic Error Handler

On our new/edit campgrounds form, if we were to type in a value for price that isn't able to be casted into a number, then our server would freak out because it's Mongoose that's trying to validate it

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img9.jpg?raw=true)


```
(node:17476) UnhandledPromiseRejectionWarning: CastError: Cast to ObjectId failed for value "Test" at path "_id" for model "Campground"
```

This is an async error. In our `app.js`, let's set up our error handler

```js
app.use((err, req, res, next) => {
    res.send('Oh boy, something went wrong')
})
```

And then let's make changes to our POST request by adding a try/catch

```js
app.post('/campgrounds', async(req, res) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }
    catch (err) {
        next(err)
    }
});
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img10.jpg?raw=true)

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img11.jpg?raw=true)

In the next section, we will have our own error class so that we don't need to put try/catch blocks in every single request code, which would take up a lot of space

## 3. Defining ExpressError Class

We will have a new folder called _utils_ where we will have our helper classes, and in that folder we will have our new `ExpressError.js` file

```js
// ExpressError.js
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
```

Now we will have another file for our catcher function called `catchAsync.js`

```js
//catchAsync.js
module.exports = funct => {
    return (req, res, next) => {
        funct(req, res, next).catch(next);
    }
}
```

Be sure to require both of these files in our `app.js`. Now our new POST request will look like this

```js
const catchAsync = require('./utils/catchAsync');
...
app.post('/campgrounds', catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

```

Right now we are not doing anything distinctively for each error, but let's start there and test it out

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img12.jpg?raw=true)

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img11.jpg?raw=true)


And now we'll apply the function to the rest of the async functions. Note that the code below is our "catch all" middleware, so what we could do is write a bunch of if statements to handle certain errors, but we'll worry about that later

```js
app.use((err, req, res, next) => {
    res.send('Oh boy, something went wrong')
})
```

## 4. More Errors

In this section, we will have more opportunities to use our `ExpressError` class

### 4.1 Bad URL's

If we request a URL that dooesn't exist, then we can put this at the very end of our routes. This is for every path. Remember that the order of this route is very important and will only run if nothing else is matched before it

```js
app.all('*', (req, res, next) => {
    res.send('404!!!!')
});
```

Let's go to some route that doesn't exist

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img13.jpg?raw=true)

We can make use of our ExpressError class

```js
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).send(message);
});
```

We are passing the `ExpressError` as `err` in the `app.use()`. Now let's go to some that doesn't exist

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img14.jpg?raw=true)

Now if we go to a campground that doesn't exist, we would get this instead

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img15.jpg?raw=true)

We're not providing a fancier message for this, but the good news is that we are handling it well, because you see that the status code is 500

### 4.2 Form Errors

Let's try to submit a form with invalid data. Even though we have form validations, that doesn't stop someone from making a request through Postman. Let's see what happens

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img16.jpg?raw=true)

It went ahead and made a blank campground. We can fix this by adding a check to see if there's any values in our request body by using and if statement

```js
app.post('/campgrounds', catchAsync(async(req, res, next) => {
    if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img17.jpg?raw=true)

## 5. Defining Error Template

### 5.1 Basic Template

We will create a new view called `error.ejs`

```html
<% layout('layouts/boilerplate') %> 
<div class="alert alert-danger" role="alert">
    <h4 class="alert-heading">Error!</h4>
    <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
    <hr>
    <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</div>
```

Then we will use that in our `app.use()`

```js
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).render('error');
});
```

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img18.jpg?raw=true)

Note that we will always get this error when we make an error, like using Postman to send invalid data

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img19.jpg?raw=true)

### 5.2 Including the Error Message and Stacktrace

In our `app.use()`, what we could do instead of destructuring is pass the entire error in the template so that we don't have a default message and status. Then from there, we can update our `error.ejs` to include that error message

```js
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) {
        err.message = 'Oh no! Something went wrong!';
    }
    res.status(statusCode).render('error', {err});
});
```

```html
<h4 class="alert-heading"><%= err.message %> </h4>
```

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img20.jpg?raw=true)

And this is what happens when we have invalid campground data

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img21.jpg?raw=true)

In development mode, it's a good idea to include the stacktrace of the error

```html
<p><%= err.stack %> </p>
```

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img22.jpg?raw=true)

## 6. JOI Schema Validations

### 6.1 JOI Intro

The last thing we will do is validate our campground data when we post or update them. The way that we are doing it is on the server-side right now. Our only real validation right now is if we are missing the data. We could post just the title and leave everything off for example. We can write our validations ourselves, but it'll take a lot of time to write, and if we have more fields, that will just take more time. We will use a tool called _JOI_, which is a JavaScript validation tool

Link to the docs
- https://joi.dev/api/?v=17.3.0

Here is an example. Basically you define some schema in JS, and we can set constraints for each of the fields

```js
const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

...
```

### 6.2 Editing Our POST Route

To install JOI, run `npm i joi`. We will require this in our `app.js`, and then we will define our schema in our POST route. **NOTE:** this is not a Mongoose schema. This will validate our data before we attempt to save it with Mongoose

```js
app.post('/campgrounds', catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required,
            price: Joi.number().required().min(0)
        }).required()
    })
    const result = campgroundSchema.validate(req.body);
    console.log(result);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

Let's test this out by sending blank data in our form

![img23](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img23.jpg?raw=true)

**NOTE:** not sure why it's saying 'YOU DONKEY'

```
{
  value: { comment: 'YOU DONKEY' },
  error: [Error [ValidationError]: "campground" is required] {
    _original: { comment: 'YOU DONKEY' },
    details: [ [Object] ]
  }
}
```

Now let's add on to our code to throw an error when validation fails

```js
app.post('/campgrounds', catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0)
        }).required()
    })
    // New piece of code
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

