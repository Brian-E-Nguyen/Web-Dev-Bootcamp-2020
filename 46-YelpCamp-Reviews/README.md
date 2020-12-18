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

