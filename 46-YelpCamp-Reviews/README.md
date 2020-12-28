# Section 46 - YelpCamp: Adding the Reviews Model

## 1. Defining The Review Model

We will make a new model file for our reviews called `review.js`

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = mongoose.model('Review', reviewSchema);
```

Since reviews are now associated with a single campground, we need to have a field called `reviews` in our campground model

```js
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
```

## 2. Adding The Review Form

We will be putting our form inside of the campground show page. It wont be a separate route, although we do need a route to submit it. Let's make a starter form and see what it looks like

```html
<form action="">
    <div class="mb-3">
        <label for="body">Review</label>
        <textarea name="review[body]" id="body" cols="30" rows="10"></textarea>
    </div>
</form>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img1.jpg?raw=true)

Let's add a lot more to it so that it looks nicer

```html
<h2>Leave a Review</h2>
<form action="" class="mb-3">
    <div class="mb-3">
        <label class="form-label" for="">Rating</label>
        <input class="form-range" type="range" min="1" max="5" name="review[rating]" id="rating">
    </div>
    <div class="mb-3">
        <label class="form-label" for="body">Review</label>
        <textarea class="form-control" name="review[body]" id="body" cols="30" rows="3"></textarea>
    </div>
    <button class="btn btn-success">Submit</button>
</form>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img2.jpg?raw=true)

## 3. Creating Reviews

In order to make a review, we need to know the campground that it belongs to. So most likely, we would just include the campground ID in the path. Let's

```js
app.post('/campgrounds/:id/reviews', catchAsync( async (req, res) => {
    res.send('YOU MADE IT!!!!!')
}))
```

And in our review form, we will add that respective route

```html
<form action="/campgrounds/<%=campground._id%>/reviews" class="mb-3" method="POST">
...
</form>
```

Now let's modify our route so that we can post a review

```js
app.post('/campgrounds/:id/reviews', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

And here's what it looks like when we post a review. As you can see, we have review object ID's inside of the `reviews` array. We have  **NOTE:** there are two reviews in there because I did successfully post a review at first but the page redirect had some bugs

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img3.jpg?raw=true)


```
> db.campgrounds.find()
{ "_id" : ObjectId("5fcd408fb5c2db3a2c4944dc"), "location" : "Albany, New York", "title" : "Maple Mule Camp", "image" : "https://source.unsplash.com/collection/483251", "description" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?", "price" : 12, "__v" : 2, "reviews" : [ ObjectId("5fdd04ba5f32105f5cf9091d"), ObjectId("5fdd050f2c78485bc45657e8") ] }

...
```

## 4. Validating Reviews

### 4.1 Modifying Our Form

We will add some basic validation for our review form. We'll start by adding client-side validation so that we can't submit an empty review.

For the input range, they're going to have a default value already, so there's no need to add the `required` tag. But we will need it for the `<textarea>` field. But then remember, we have to do this weird thing where we tell the form not to validate with HTML; we are letting our JavaScript code inside of our `boilerplate.js` to do that, so we need to add `validated-form` inside of the value of `class`

```html
<form action="/campgrounds/<%=campground._id%>/reviews" class="mb-3 validated-form" method="POST" novalidate>
    ...
    <div class="mb-3">
        <label class="form-label" for="body">Review</label>
        <textarea class="form-control" name="review[body]" id="body" cols="30" rows="3" required></textarea>
    </div>
    <button class="btn btn-success">Submit</button>
</form>
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img4.jpg?raw=true)

And we can add the validation feedback right under the `<textarea>`

```html
<form action="/campgrounds/<%=campground._id%>/reviews" class="mb-3 validated-form" method="POST" novalidate>
    ...
    <div class="mb-3">
        <label class="form-label" for="body">Review</label>
        <textarea class="form-control" name="review[body]" id="body" cols="30" rows="3" required></textarea>
        <div class="valid-feedback">
            <p>Looks good!</p>
        </div>
    </div>
    <button class="btn btn-success">Submit</button>
</form>
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img5.jpg?raw=true)

### 4.2 Joi Review Schema

Remember that we still need a way to prevent making requests that would circumvent using the form, which could lead to empty fields, like using Postman. Let's make a new Joi review object inside of our `schemas.js` file

```js
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
});
```

### 4.3 Middleware Function

Now we will import it into our `app.js` and set up a function to validate our data

```js
const {campgroundSchema, reviewSchema} = require('./schemas.js');
...
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
};
```

And then in our POST review route, we will add that middleware function so it will validate our review before it gets posted

```js
app.post('/campgrounds/:id/reviews', validateReview, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

### 4.4 Validation Testings

Now let's test everything out. Grab the URL from the campground page and append `/reviews` to it. Let's try so send blank data

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img6.jpg?raw=true)

Let's edit our ratings field so that it has a min and max number, then try putting a number outside of the range, then inside of it

```js
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required()
            .min(1)
            .max(5),
        body: Joi.string().required()
    }).required()
});
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img7.jpg?raw=true)

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img9.jpg?raw=true)

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img10.jpg?raw=true)


## 5. Displaying Reviews

If we go to our show page for camps, we don't have access to any reviews. What is in our reviews array is just a bunch of object ID's. What we need to do is to populate our campground with ID's. Let's modify our GET request for a specifc campground to populate it with reviews

```js
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate('reviews');
    console.log(campground);
    res.render('campgrounds/show', {campground});
}));
```

```
{
  reviews: [
    {
      _id: 5fdd04ba5f32105f5cf9091d,
      body: 'Too crowded but very pretty',
      __v: 0
    },
    {
      _id: 5fdd050f2c78485bc45657e8,
      body: 'Too crowded, but very pretty',
      __v: 0
    },
    {
      _id: 5fdd1776db545462202c2dfc,
      rating: 1,
      body: 'AHHHHHHHHHHHHHHHHHHHHH',
      __v: 0
    }
  ],
  _id: 5fcd408fb5c2db3a2c4944dc,
  location: 'Albany, New York',
  title: 'Maple Mule Camp',
  image: 'https://source.unsplash.com/collection/483251',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?',
  price: 12,
  __v: 3
}
```

Now we see that we have our reviews. Now what we need to do inside of our campground show page is to loop over all of the reviews. We'll add this code just below our form

```js
<% for( let review of campground.reviews ) { %>
<div class="mb-3">
    <p>Rating: <%= review.rating %> </p>
    <p>Review: <%= review.body %> </p>
</div>
<% } %>
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img11.jpg?raw=true)

## 6. Styling Reviews

### 6.1 Using Bootstrap Classes

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img12.jpg?raw=true)

We have these reviews for a campground but it's really hard to tell them apart. Let's add a border around each one using the `card` class provided by Bootstrap. We will wrap this around the existing HTML tags for the review

```html
<% for( let review of campground.reviews ) { %>
<div class="card mb-3">
    <div class="card-body">
    <p>Rating: <%= review.rating %> </p>
    <p>Review: <%= review.body %> </p>
    </div>
</div>
<% } %>
```

Let's add a little bit more to the reviews so that it looks nicer

```html
<% for( let review of campground.reviews ) { %>
<div class="card mb-3">
    <div class="card-body">
    <h5 class="card-title">Rating: <%= review.rating %> </h5>
    <p class="card-text">Review: <%= review.body %> </p>
    </div>
</div>
<% } %>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img2.jpg?raw=true)


### 6.2 Reorganizing Reviews

Instead of inputting the reviews at the bottom, let's move it to the right of the campground card. We will plan on doing a 50/50 split between the two columns. First we will remove the `offset-3` in `<div class="col-6 offset-3">` so that the campground card is no longer in the middle, then we will move the review in the other `col-6`.

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img14.jpg?raw=true)

## 7. Deleting Reviews

Next up, we will add a delete button for each review. Right now, nobody owns a review and we can delete every review we see; we'll add something in the future so that only the owner of the review can delete their reviews

Let's set up a simple delete route, and the path will include the review ID

```js
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    res.send('DELETE ME!!!!');
}));
```

The reason why we need the campground ID is that we want to remove the reference to whatever the review is in the campground, and we want to remove the review itself

Now let's set up the delete "form" on our show page, just inside of our review card. We don't need any validators since this is not an actual form

```html
<% for( let review of campground.reviews ) { %>
<div class="card mb-3">
    <div class="card-body">
    <h5 class="card-title">Rating: <%= review.rating %> </h5>
    <p class="card-text">Review: <%= review.body %> </p>
    <form action="/campgrounds/<%=campground._id%>/reviews/<%=review._id%>" method="post">
        <button class="btn btn-sm btn-danger">  
        Delete
        </button>
    </form>
    </div>
</div>
<% } %>
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img15.jpg?raw=true)

Since we are using method-override, we would need the query string at the end of our route

```html
<form action="/campgrounds/<%=campground._id%>/reviews/<%=review._id%>?_method=DELETE" method="post">
    <button class="btn btn-sm btn-danger">  
    Delete
    </button>
</form>
```

So right now we are not deleting anything, but when we click on the Delete button, we should get redirected

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img16.jpg?raw=true)

Let's fix our route so that it deletes our review. This is a two way operation, where we delete the review itself, and in the campgrounds, we remove the reference to the review. We will use a Mongo operator called `$pull`, which removes from an array all instances of a value or values that match a specific condition

```js
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}));
```

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img17.jpg?raw=true)

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img18.jpg?raw=true)