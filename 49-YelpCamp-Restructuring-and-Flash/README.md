# Section 49 - YelpCamp: Restructuring & Flashh

## 1. Breaking Out Campground Routes

So now that we've talked about the Express Router, let's go ahead and break up our routes into different into different files. Let's make a new folder called _routes_, and inside of there, we will create a new file called `campgrounds.js` and we will put our campgrounds routes in there. Note that whenever we break things up, there's a good chance that things can go wrong. We've got to move certain `require`'s over into the right folder and change their path

Inside of our `campgrounds.js`, replace all `app` with `router`. At the very bottom of the file, we will export `router`

```js
// campgrounds.js

router.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));

...

module.exports = router;
```

We will then import `campgrounds` into our `app.js` like this

```js
const campgrounds = require('../routes/campgrounds');
...
app.use('/campgrounds', campgrounds);
```

This prepends the string '/campgrounds' into all of our campground routes. We would want to remove them in all of routes in `campgrounds.js`, and we would also need to import our `catchAsync` and `validateCampground` functions into this file

```js
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));
...
```

**Author Note:** the video of this section is pretty messy when it came to the necessary imports, so make sure you have all of these in your `campgrounds.js`

```js
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const router = express.Router();
const Campground = require('../models/campgrounds');

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
};
```

## 2. Breaking Out Review Routes

### 2.1 Fixing Our Routes

We will repeat a similar process for our reviews. This one will be a lot simpler since we only have 2 review routes. Let's make a `reviews.js` file in our _routes_ folder

```js
const express = require('express');
const router = express.Router();

router.post('/campgrounds/:id/reviews', validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;
```

And in our `app.js`, we will use this middleware for our routes

```js
const reviews = require('./routes/reviews');
...
app.use('/campgrounds/:id/reviews', reviews);
```

This is what our imports in our `reviews.js` schema should look liek

```js
const express = require('express');
const router = express.Router();

const Campground = require('../models/campgrounds');
const Review = require('../models/review');

const {reviewSchema} = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
```

### 2.2 Running Into a New Error

So now when we create a review, we run into a new error

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img1.jpg?raw=true)

Let's take a look at our POST request. It isn't able to find an ID. This happens with Express router because it likes to keep things separate. 

```js
router.post('/', validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

To fix this, we will have to edit our router by passing in a parameter in it

```js
const router = express.Router({mergeParams: true});
```

Now all of the params in `app.js` will be merged with the ones in `reviews.js`

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img3.jpg?raw=true)


## 3. Serving Static Assets

### 3.1 Serving Test

The next thing we'll do is serving static assets, which is pretty simple. First we should add a _public_ directory inside of our _views_ directory where we can serve images, scripts, etc. Let's create a `hello.js` to test it out

```js
alert('HELLO FROM THE PUBLIC DIRECTORY!!!!!!!');
```

And inside of our `boilerplate.js`, we will have this line of code 

```js
<script src="/hello.js"></script>
```

If we try to load a page, we get this error

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img4.jpg?raw=true)

This is because we need to tell Express to load static files. We can do that in `app.js` with this line of code

```js
app.use(express.static('public'));
```

Now let's test this out

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img5.jpg?raw=true)

### 3.2 Moving Bootstrap Code

Cool it works. Let's delete the line of code in our `boilerplate.js`. Next thing we should do is move all of the bootstrap client-side form validationcode in our `boilerplate.js` to another file. Let's call it `validateForms.js`. Once we move all of that code, we will put this script tag at the bootom of our `boilerplate.js`

```html
<script src="/validateForms.js"></script>
```

When we start building our _public_ folder, it's a good idea to separate the file types into subfolders. We will put our `validateForms.js` into a _js_ folder

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img6.jpg?raw=true)

So now we have to change our path in our script tag

```html
<script src="/validateForms.js"></script>
```

And now, our form validations should work

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img7.jpg?raw=true)

Let's go the extra mile and use `path.join` in our `express.static()` code

```js
app.use(express.static(path.join(__dirname, 'public')));
```

### 3.3 Deprecation Warning Fix

```
(node:11448) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
```

We have a deprecation warning, so let's fix that by adding `useFindAndModify: false` in our mongoose connection code

```js
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
```

## 4. Configuring Session

### 4.1 Setting Up Session

In this section, we're adding Express Session in our application. There are two reasons for having sessions in our app: 

1. to implement Flash so that we can show temporary messages to the user
2. we'll be adding authentication

Let's download Express Session into our YelpCamp app and require it in `app.js`

```js
const session = require('express-session');

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
}
app.use(session(sessionConfig))
```

There will be a lot of stuff that we can configure with session, but we will come back to that. Once we get our app running, we will have some changes coming, like security, memory store, etc. Let's test the session out by running the app. When we make a request, we get our own session ID, just to prove that it's working

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img8.jpg?raw=true)

### 4.2 Adding to sessionConfig

Now what we're gonna do is add some fancier options to `sessionConfig`. We will have the cookie expire in a week

```js
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // 1000 milliseconds in a second
        // 60 seconds in a minute
        // 60 minutes in an hour
        // 24 hours in a day
        // 7 days in a week
        // This cookie will expire in a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
```

And now when we look at the cookie, we see that it has a new value in the _Expires_ tab, which tells us that the cookie will expire in a week from now. One of the reasons why we want this is because we don't want a user to stay logged in for a long time

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img9.jpg?raw=true)

We will also set HttpOnly to this cookie. HttpOnly means that if this flag is included on a cookie, the cookie cannot be accessed through client-side scripts. It's an added layer of security It's already set to true by default in the browser, but let's ensure that it always happens.

```js
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/49-YelpCamp-Restructuring-and-Flash/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img10.jpg?raw=true)
