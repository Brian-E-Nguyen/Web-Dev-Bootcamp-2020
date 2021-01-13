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

## 1. Breaking Out Review Routes
