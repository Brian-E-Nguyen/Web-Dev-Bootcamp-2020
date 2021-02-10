# Section 53 - YelpCamp: Controllers & Star Ratings

## 1. Refactoring To Campgrounds Controller

### 1.1 How Refactoring Will Work

We're just going to focus on reorganizing our code a bit. The files in our _routes_ folder are getting quite long and we're not even done yet with them. What we like to do is introduce a pattern that is not unique to Express in any way. We'll define what we'll call _controllers_ for campgrounds, reviews, AuthN, and users.

For example, in our `camgrounds.js` route file, we have this POST route

```js
router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

We can make it concise by taking everything from `catchAsync` to the end of the code, and moving them to our campground controller. We will slim our routes down as much as possible. Then we will create functions with meaningful names so that you know what their functionalities are.

### 1.2 Brief MVC Info

We are following the **Model, View, Controller (MVC)** pattern, in which

- models are the data
- views are the pages that the users see in the app
- controllers are the logic behind the app

### 1.3 Moving Our Code to the Campground Controller

Let's make a new folder called _controllers_ and make a `campgrounds.js` to start off. Inside of our controller file, we will export specific functions. Let's use the '/' GET route and export the async function

```js
// controllers/campgrounds.js
const Campground = require('../models/campgrounds');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}
```

Then we will require it in our routes file and use the exported `index` function

```js
// routes/campgrounds.js
const campgrounds = require('../controllers/campgrounds');
...
router.get('/', catchAsync(campgrounds.index));
```

We can continue the process for the rest of the routes

```js
// routes/campgrounds.js

const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
```

## 2. Adding a Reviews (and Users) Controller

Let's make another file in our _controllers_ directory called `reviews.js` and refactor everything, just like we did with our `campgrounds.js` routes

```js
// routes/reviews.js
const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
```

```js
// controllers/reviews.js
const Campground = require('../models/campgrounds');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    ...
}

module.exports.deleteReview = async (req, res) => {
    ...
}
```

The same thing goes with the 'users' controller and routes. You get the idea

