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

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img1.jpg?raw=true)

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

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img3.jpg?raw=true)


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

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img4.jpg?raw=true)

This is because we need to tell Express to load static files. We can do that in `app.js` with this line of code

```js
app.use(express.static('public'));
```

Now let's test this out

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img5.jpg?raw=true)

### 3.2 Moving Bootstrap Code

Cool it works. Let's delete the line of code in our `boilerplate.js`. Next thing we should do is move all of the bootstrap client-side form validationcode in our `boilerplate.js` to another file. Let's call it `validateForms.js`. Once we move all of that code, we will put this script tag at the bootom of our `boilerplate.js`

```html
<script src="/validateForms.js"></script>
```

When we start building our _public_ folder, it's a good idea to separate the file types into subfolders. We will put our `validateForms.js` into a _js_ folder

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img6.jpg?raw=true)

So now we have to change our path in our script tag

```html
<script src="/validateForms.js"></script>
```

And now, our form validations should work

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img7.jpg?raw=true)

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

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img8.jpg?raw=true)

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

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img9.jpg?raw=true)

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

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img10.jpg?raw=true)

## 5. Setting Up Flash

### 5.1 Installing Flash and Modifying Route

Let's add in Flash so that we can show temporary messages to the user. These can happen when the user:

1. Create, update, or delete a review
2. Create, update, or delete a campground
3. (Un)successfully authenticate themselves

So we need to first install _connect-flash_ and require it in our `app.js`

```js
const flash = require('connect-flash');
...
app.use(flash());
```

To remind you how this works, we should be able to flash something by calling `req.flash()` and passing in a key with its value. Let's test this out in our POST request of our campgrounds

```js
router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

Now we just need to display that information in our template. Let's use our GET route that gets a campgroud by ID

```js
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate('reviews');
    res.render('campgrounds/show', {campground, msg: req.flash('success')});
}));
```

### 5.2 Template Middleware

But as you remember in the last course, there's an easier way to do that. We can set up a middleware that will just take everything on every request and will add to the template. Let's go into our `app.js` and define a middleware before our route handlers

```js
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
});
```

This middleware will allow us to have access to our templates autoimatically; we don't have to pass them through. This is why we set up this middleware on every request.

Now let's go into our boilerplate and do something basic to start

```html
<main class="container mt-5">
    <%= success %> 
    <%- body %> 
</main>
```

Let's make a new campground to see if it works

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img11.jpg?raw=true)

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img12.jpg?raw=true)

Now if we were to refresh the page, the message will not pop up

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img13.jpg?raw=true)

## 6. Flash Success Partial

### 6.1 Creating Our Partial

The next thing we'll do is set up a nice partial to spruce up our Flash, to make it look nicer for the user. We will use Bootstrap to create it in our new partials file called `flash.ejs`. This is what it contains:

```html
<!-- flash.ejs -->
<div class="alert alert-success" role="alert">
    <%= success %> 
</div>
```

The thing is, we only want this to show up on the page if there is anything in success. So we could just begin on our boilerplate file by always including that template

```html
<main class="container mt-5">
    <%- include('../partials/flash') %> 
    <%- body %> 
</main>
```

So now when we refresh the page, we always get this empty green alert, even if there's nothing there

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img14.jpg?raw=true)

So now in our `flash.ejs`, let's add some logic that checks to see if `success` exists. `success` is an array, and if there's any messages inside of it

```html
<!-- flash.ejs -->
<% if (success && success.length) { %>
    <div class="alert alert-success" role="alert">
        <%=success%> 
    </div>
<% } %>
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img15.jpg?raw=true)

Let's make a new campground to test it out

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img16.jpg?raw=true)

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img17.jpg?raw=true)


### 5.2 Dismissing the Partial

Right now the message is not dismissable, so let's add that functionality. Inside of our partial, we want to add the classes `alert-dismissible fade show` and we have to add a button to dismiss it. **IMPORTANT:** make sure all of the CDN links are updated. The previous one used in this course does not support the code below

```html
<!-- flash.ejs -->
<% if (success && success.length) { %>
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <%=success%> 
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
<% } %>
```

Now when we make a new campground, we get the flash message with the 'X' option to dismiss it

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img18.jpg?raw=true)


### 6.3 More Flash Messages

The next thing we'll do is to make more flash messages for certain actions. So we have a success message when we create a campground; let's make one when we update a campground

```js
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    // new piece of code
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img19.jpg?raw=true)

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img20.jpg?raw=true)


And we can have a flash message for creating a new review

```js
router.post('/', validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    // new piece of code
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img21.jpg?raw=true)

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img22.jpg?raw=true)

And we should do the same thing when you delete a review and a campground. I'm not gonna put the demonstration of it because you already get the idea

## 6. Flash Errors Partial

Let's create a partial for any errors in our app. Inside of our `flash.ejs`, we will duplicate our existing 'success' code and replace it with `error`. We will need to add the `error` local variable in our middleware in our `app.js

```js
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

```

```html
<!-- flash.ejs -->
<% if (error && error.length) { %>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <%= error %>
        <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        ></button>
    </div>
<% } %>
```

So the first example of where something can go wrong is if we bookmarked a campground's link, then someone deletes that campground, then we go to that link, we get this on our page

![img23](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img23.jpg?raw=true)

Let's take a look in our GET campground by ID route. It's saying that we are passing in an empty campground into our `res.render()` function

```js
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate('reviews');
    res.render('campgrounds/show', {campground});
}));
```

Let's modify it so that it first checks to see if the campground doesn't exist. If so, we will redirect the user to the campgrounds page and flash an error message

```js
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}));
```

![img24](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/49-YelpCamp-Restructuring-and-Flash/img-for-notes/img24.jpg?raw=true)

We can also put that campground checker when we attempt to edit a nonexistent campground