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

## 3. A Fancy Way To Restructure Routes

We'll see a way of grouping similar routes together, or rather, routes that have the same path, but different verbs. We can use a method called `router.route(path)`, which lets us define a single route that handles different verbs, i.e. chaining on PUT, GET, etc. In our `routes/campgrounds.js`, let's start with grouping the `/` routes together

```js
// routes/campgrounds.js
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
```

We also have some routes that are standalones, which won't make sense to group them, and we also have others that have the same path. This is what our finished grouping should look like:

```js
// routes/campgrounds.js

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
```

Note that we need to put the `/new` route before the `/:id` group or things would break. Let's do the same grouping for `routes/users.js`

```js
// routes/users.js
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', users.logout);
```

## 4. Displaying Star Ratings

What we will do now is having star ratings by clicking on the stars instead of having a slider. Also instead of having "Rating: ___", we will display the number of stars. We could do this from scratch ourselves by using a star entity codes, but we won't because it's annoying and extra difficult. We'll instead use a library called _Starability_

**Link to GitHub page**

- https://github.com/LunarLogic/starability

We will use the `starability-basic.css` file and put it in our _public/css_ directory, then we will include it in our `show.ejs`

```js
<% layout('layouts/boilerplate') %> 
<link rel="stylesheet" href="/css/stars.css">

...
```

Let's put this code in the review card to test it out

```html
<h3>Rated element name</h3>
<p class="starability-result" data-rating="3">
    Rated: 3 stars
</p>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main//53-YelpCamp-Controllers-and-Star-Ratings/img-for-notes/img1.jpg?raw=true)

Now what we want to do is to display the number of stars based on the review rating instead of hardcoding the values

```html
<p class="starability-result" data-rating="<%= review.rating %>">
    Rated: <%= review.rating %> stars
</p>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main//53-YelpCamp-Controllers-and-Star-Ratings/img-for-notes/img2.jpg?raw=true)

## 5. Star Rating Form

Lastly, we will replace the slider with a star clicker. What we need to do is use this code that is given to us from the _Starability_ docs, and then put it at the very top of our review form

```html
<fieldset class="starability-basic">
  <legend>First rating:</legend>
  <input type="radio" id="no-rate" class="input-no-rate" name="rating" value="0" checked aria-label="No rating." />
  <input type="radio" id="first-rate1" name="rating" value="1" />
  <label for="first-rate1" title="Terrible">1 star</label>
  <input type="radio" id="first-rate2" name="rating" value="2" />
  <label for="first-rate2" title="Not good">2 stars</label>
  <input type="radio" id="first-rate3" name="rating" value="3" />
  <label for="first-rate3" title="Average">3 stars</label>
  <input type="radio" id="first-rate4" name="rating" value="4" />
  <label for="first-rate4" title="Very good">4 stars</label>
  <input type="radio" id="first-rate5" name="rating" value="5" />
  <label for="first-rate5" title="Amazing">5 stars</label>
</fieldset>
```

Then, for each of the `name` values in the `<input>` tags, we will add `review[rating]`. 

```html
<fieldset class="starability-basic">
    <legend>First rating:</legend>
    <input type="radio" id="no-rate" class="input-no-rate" name="review[rating]" value="0" checked aria-label="No rating." />
    <input type="radio" id="first-rate1" name="review[rating]" value="1" />
    <label for="first-rate1" title="Terrible">1 star</label>
    <input type="radio" id="first-rate2" name="review[rating]" value="2" />
    <label for="first-rate2" title="Not good">2 stars</label>
    <input type="radio" id="first-rate3" name="review[rating]" value="3" />
    <label for="first-rate3" title="Average">3 stars</label>
    <input type="radio" id="first-rate4" name="review[rating]" value="4" />
    <label for="first-rate4" title="Very good">4 stars</label>
    <input type="radio" id="first-rate5" name="review[rating]" value="5" />
    <label for="first-rate5" title="Amazing">5 stars</label>
</fieldset>
```

Let's test it out now

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main//53-YelpCamp-Controllers-and-Star-Ratings/img-for-notes/img3.jpg?raw=true)

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main//53-YelpCamp-Controllers-and-Star-Ratings/img-for-notes/img4.jpg?raw=true)
