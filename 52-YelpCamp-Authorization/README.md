# Section 52 - YelpCamp: Basic Authorization

## 1. Adding An Author to Campground

### 1.1 Author Field

Let's the user model to particular campgrounds and reviews so that when we create a review or campground, our account is associated with it. Let's go to the campground model and add in a new field into our schema called `author`, and it'll be a reference to another schema

```js
// campgrounds.js
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
```

None our data has an author in our DB. Let's update our seeds file to say that every campground belongs to me, and we'll do this by first searching for our ID and hardcoding it into our seed function. Note that you would need to supply your own ID

```js
// index.js
const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            /*
            (((((((((((((((((((((())))))))))))))))))))))
            NEW FIELD RIGHT HERE
            (((((((((((((((((((((())))))))))))))))))))))
            */
            author: '6014644ae18c19056071bdb6',
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?",
            price: price
        });
        await camp.save();
    }
}
```

```
> db.campgrounds.find({})

{ "_id" : ObjectId("60184efb8076cf368cc56662"), "reviews" : [ ], "author" : ObjectId("6014644ae18c19056071bdb6"), "location" : "Woonsocket, Rhode Island", "title" : "Misty River", "image" : "https://source.unsplash.com/collection/483251", "description" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis 
quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?", "price" : 20, "__v" : 0 }

{ "_id" : ObjectId("60184efb8076cf368cc56663"), "reviews" : [ ], "author" : ObjectId("6014644ae18c19056071bdb6"), "location" : "Jefferson City, Missouri", "title" : "Sea Group Camp", "image" : "https://source.unsplash.com/collection/483251", "description" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?", "price" : 21, "__v" : 0 } 

...
```

Now all campgrounds are associated with that user ID.

### 1.2 Displaying User Who Submitted Campground on Show Page

In our 'show' route, let's display who created that campground. In our campground route, we will chain onto our campground search by ID by populating it with author

```js
// campground.js
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate('reviews')
        .populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}));
```

When we `console.log()` the campground object, this is what we get when we go to a specific campground

```
{
  reviews: [],
  _id: 60184efb8076cf368cc56662,
  author: {
    _id: 6014644ae18c19056071bdb6,
    email: 'tim@gmail.com',
    username: 'tim',
    __v: 0
  },
  location: 'Woonsocket, Rhode Island',
  title: 'Misty River',
  image: 'https://source.unsplash.com/collection/483251',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?',
  price: 20,
  __v: 0
}
```

Now in our `show.ejs`, we will add an `<li>` tag to display our author

```html
<ul class="list-group list-group-flush">
    <li class="list-group-item"><%= campground.location %></li>
    <li class="list-group-item">Submitted by <%= campground.author.username %></li>
    <li class="list-group-item">$<%= campground.price %>/night</li>
</ul>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img1.jpg?raw=true)

### 1.2 Associating User During Campground Creation

We will now associate a user with the campground during campground creation. We can take the user ID and save it as the author for the campground

```js
router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

Let's make a new account and create a campground to test it out

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img3.jpg?raw=true)

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img4.jpg?raw=true)

## 2. Showing and Hiding Edit/Delete

If we are signed in as Mimi for example, we still can delete or edit other's campgrounds. There's two things we can do

1. Don't show the edit/delete buttons when viewing another user's campground. Only show them if we are the owner of that campground
2. Protecting our PUT and DELETE routes

Let's start with the first one by adding a conditional in our `show.ejs`

```html
<% if (currentUser && campground.author.equals(currentUser._id)) { %>
<div class="card-body">
    <a class="card-link btn btn-warning" href="/campgrounds/<%=campground._id%>/edit">Edit</a>
    <form class="d-inline" action="/campgrounds/<%=campground._id%>?_method=DELETE" method="post">
        <button class="btn btn-danger">Delete</button>
    </form>
</div>
<% } %> 
```

In the conditional, the reason why we have to check for `currentUser` is that if we didn't, and we look at the page when we are not signed in, then the whole thing will break.

Now that we edited our template, let's try this out when we are not signed in, when we are signed in and viewing another one's campground, and when we are signed in and viewing our own campground

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img5.jpg?raw=true)

Now we are signed in as 'mimi'

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img6.jpg?raw=true)

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img7.jpg?raw=true)

There's still a problem where someone can still go to the backend and modify the campgrounds they don't own. We'll fix that in the next section

## 3. Campground Permissions

We can still send a DELETE / PUT request through Postman, or we can still use the URL to go to that route. Let's fix the update first. Before we update anything, we want to check to see if the campground has the same author ID as the current user's. 

```js
// campground.js
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

We would have to break this up. First, we need to find the campground; then, check to see if the campground's author is the same as the current user

```js
// campground.js
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img9.jpg?raw=true)

We should also add this code into our DELETE route and the GET route where we view the edit form

## 4. Authorization Middleware

### 4.1 isAuthor Middleware

Let's take the new authorization code and put it into its own middleware. We will call the function `isAuthor()`. We will test this out on our 'edit campground' GET route

```js
const isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
```

```js
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}));
```

Let's view a campground that's not ours when we are not currently logged in. We first see that there's no "Edit" button. When we type in the edit route for a campground that's not ours, we are redirected to the login page. When we log in successfully, we see a message saying that we don't have permissions to edit that page

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/52-YelpCamp-Authorization/52-YelpCamp-Authorization/img-for-notes/img10.jpg?raw=true)

We can apply the `isAuthor()` middleware to the update and delete route

### 4.2 Moving Middleware

Let's move the middleware in `campgrounds.js` to the `middleware.js` file to refactor the former. We will also move some imports as well. Note that you will need to change the paths of them

```js
// middleware.js
const {campgroundSchema} = require('./schemas.js');
const {ExpressError} = require('./utils/ExpressError');
const Campground = require('./models/campgrounds');

module.exports.validateCampground = (req, res, next) => {...}

module.exports.isAuthor = async(req, res, next) => {...}
```

And we will destructure those middleware in our `campgrounds.js` 

```js
// campgrounds.js
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
```

Let's also move our reviews middleware into the `middleware.js` file

```js
const {campgroundSchema, reviewSchema} = require('./schemas.js');

module.exports.validateReview = (req, res, next) => {
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

And in our `reviews.js`, we would need to import that middleware

```js
// reviews.js
const {validateReview} = require('../middleware');
```