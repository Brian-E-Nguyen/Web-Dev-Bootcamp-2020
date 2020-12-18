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