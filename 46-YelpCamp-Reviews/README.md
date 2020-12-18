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
        <input class="form-range" type="range" min="1" max="5" name="review[name]" id="rating">
    </div>
    <div class="mb-3">
        <label class="form-label" for="body">Review</label>
        <textarea class="form-control" name="review[body]" id="body" cols="30" rows="3"></textarea>
    </div>
    <button class="btn btn-success">Submit</button>
</form>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/46-YelpCamp-Reviews/46-YelpCamp-Reviews/img-for-notes/img2.jpg?raw=true)
