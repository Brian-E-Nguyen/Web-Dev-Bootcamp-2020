# Section 39 - YelpCamp: Campgrounds CRUD

## 1. YelpCamp: Our Massive project

We will take everything we have learned to build a massive app called __YelpCamp__

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img1.jpg?raw=true)

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img3.jpg?raw=true)

## 2. Access to YelpCamp Code

https://github.com/Colt/YelpCamp/tree/c12b6ca9576b48b579bc304f701ebb71d6f9879a

When you download it, be sure to run `npm install` to get all of the packages and dependencies

Each sections has its own code. If you want to see thhe differences between codes, click on the commit ID to see the git diff

## 3. Creating the Basic Express App

### 3.1 Initializing Our App

We'll be creating our express app inside of the _YelpCamp_ folder so we can easily transfer it to other sections

1. `npm init -y`
2. `npm i express mongoose ejs`
3. Make `app.js`

And now we'll put this in our `app.js` and test it out

```js
const express = require('express');
const app = express();
const portNumber = 3000;

app.get('/', (req, res) => {
    res.send('HELLO FROM YELPCAMP')
});

app.listen(portNumber, () => {
    console.log(`SERVING ON PORT ${portNumber}`);
});
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img4.jpg?raw=true)

### 3.2 Views Directory

Now let's make our initial view file called `home.ejs` which will be inside of our _views_ directory. We'll now update our `app.js` file to include using the EJS view engine and setting our home path to use `home.ejs`

```js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
});

app.listen(portNumber, () => {
    console.log(`SERVING ON PORT ${portNumber}`);
});
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img5.jpg?raw=true)

## 4. Campground Models Basic 

### 4.1 Creating Our Campground Model

We will make a _models_ directory, and in it we will make a `campgrounds.js`

```js
// campgrounds.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);
```

### 4.2 Requiring Mongoose and Our Model

Then we will require mongoose in our `app.js`. We will also import some previous code to handle errors

```js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const portNumber = 3000;

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

...
```

And now when we run our `app.js`, we should see that we have connected to the DB

```
$ nodemon app.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
SERVING ON PORT 3000
Database connected
```

### 4.3 Testing Our Data

Let's try hardcoding a campground to see if it works. We will require our campgrounds model in our `app.js` and set up a GET route

```js
// app.js
const Campground = require('./models/campgrounds');
...
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({
        title: 'My Backyard', 
        description: 'cheap camping!'
    });
    await camp.save();
    res.send(camp);
});
```

Now let's send a GET request to see if it works

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img6.jpg?raw=true)

And now let's check our yelp-camp db

```
> use yelp-camp
switched to db yelp-camp
> db.campgrounds.find() 
{ "_id" : ObjectId("5fc7eb410e7df60c3003eafa"), "title" : "My Backyard", "description" : "cheap camping!", "__v" : 0 }
```

## 5. Seeding Campgrounds

### 5.1 index.js File

We will make a _seeds_ folder to have two new seed files, `cities.js` and `seedHelpers.js`, and then we will make an `index.js` file inside of that folder


```js
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async() => {
    await Campground.deleteMany({});
    const c = new Campground({title: 'purple fields'})
    await c.save();
}

seedDB();
```

Now we'll execute `seeds/index.js` to see our data

```
$ node seeds/index.js
Database connected
```

```
> db.campgrounds.find()
{ "_id" : ObjectId("5fc7eec175f6f146dc0c05fb"), "title" : "purple fields", "__v" : 0 }
```

### 5.2 Using cities.js

Now we'll use our `cities.js` seed file to test it out. We'll make a few modifications to our `seeds/index.js` file by importing our `cities.js` and making some changes to our `seedDB()` function

```js
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');

...

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`
        });
        await camp.save();
    }
}

seedDB();
```

```
> db.campgrounds.find()
{ "_id" : ObjectId("5fc7f024b2afb75b789e4173"), "location" : "West Covina, California", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4174"), "location" : "Stamford, Connecticut", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4175"), "location" : "Tigard, Oregon", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4176"), "location" : "Lancaster, Ohio", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4177"), "location" : "Fort Wayne, Indiana", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4178"), "location" : "Blaine, Minnesota", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4179"), "location" : "Garland, Texas", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e417a"), "location" : "Montebello, California", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e417b"), "location" : "Euclid, Ohio", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e417c"), "location" : "Urbandale, Iowa", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e417d"), "location" : "Midland, Michigan", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e417e"), "location" : "Santa Rosa, California", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e417f"), "location" : "Los Angeles, California", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4180"), "location" : "Rochester, New York", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4181"), "location" : "Logan, Utah", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4182"), "location" : "Newark, New Jersey", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4183"), "location" : "Troy, New York", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4184"), "location" : "Kentwood, Michigan", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4185"), "location" : "Yorba Linda, California", "__v" : 0 }
{ "_id" : ObjectId("5fc7f024b2afb75b789e4186"), "location" : "Bolingbrook, Illinois", "__v" : 0 }
Type "it" for more
```

### 5.3 Using seedHelpers.js

We will modify our data in our DB by adding a place and descriptor. We will import them into our `seeds/index.js`

```js
const {places, descriptors} = require('./seedHelpers');
...
// Returns a random element from the array
const sample = array => array[Math.floor(Math.random() * array.length)];
...
const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}
```

```
> db.campgrounds.find()
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4b8"), "location" : "Lee's Summit, Missouri", "title" : "Sea Spring", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4b9"), "location" : "Pasadena, Texas", "title" : "Diamond Hollow", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4ba"), "location" : "Columbia, South Carolina", "title" : "Maple Spring", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4bb"), "location" : "Lake Forest, California", "title" : "Ocean Group Camp", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4bc"), "location" : "Bullhead City, Arizona", "title" : "Petrified Cliffs", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4bd"), "location" : "Kettering, Ohio", "title" : "Cascade Flats", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4be"), "location" : "Columbus, Indiana", "title" : "Petrified Spring", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4bf"), "location" : "Sammamish, Washington", "title" : "Dusty Creek", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c0"), "location" : "Fort Wayne, Indiana", "title" : "Grizzly Creekside", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c1"), "location" : "Macon, Georgia", "title" : "Ancient Pond", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c2"), "location" : "Escondido, California", "title" : "Maple Horse Camp", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c3"), "location" : "Santa Ana, California", "title" : "Silent Backcountry", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c4"), "location" : "Bryan, Texas", "title" : "Silent Dispersed Camp", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c5"), "location" : "Marana, Arizona", "title" : "Ancient Cliffs", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c6"), "location" : "Evanston, Illinois", "title" : "Bullfrog Bayshore", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c7"), "location" : "West Sacramento, California", "title" : "Roaring Horse Camp", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c8"), "location" : "Wilmington, Delaware", "title" : "Redwood Hunting Camp", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4c9"), "location" : "Portland, Maine", "title" : "Diamond Spring", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4ca"), "location" : "Lowell, Massachusetts", "title" : "Silent Village", "__v" : 0 }
{ "_id" : ObjectId("5fc7f3698ea13433fc4ab4cb"), "location" : "Plainfield, Illinois", "title" : "Diamond Creekside", "__v" : 0 }
```

## 6. Campground Index

### 6.1 Making Our Route

In our `app.js` file, we don't need `app.get('/makecampgroud)` so we'll delete it. We will set up other different routes

```js
// app.js
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});
```

### 6.2 Making Our View and Displaying Our Data

Then we will add a new _campgrounds_ directory inside of our _views_ directory to have our `index.ejs` file. We will add the following code to display our data

```html
<h1>All Campgrounds</h1>
<ul>
    <% for( let campground of campgrounds ) { %>
        <li><%= campground.title %> </li>
    <% } %>
</ul>
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img7.jpg?raw=true)

## 7. Campground Show

This view will show more information about each campground

### 7.1 Modifying index.ejs

We want each of the the campgrounds shown in `index.ejs` to take you to its own page. To do this, we would need to use an anchor tag. 

```html
 <ul>
    <% for( let campground of campgrounds ) { %>
        <li> <a href="/campgrounds/<%=campground._id%> "><%= campground.title %></a> </li>
    <% } %>
</ul>
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img9.jpg?raw=true)

### 7.2 Modifying Our Route

We want to find the campground by ID, so we need to extract the ID from the URL and use it to find the campground

```js
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
});
```

### 7.3 Our Show Page

Now that we passed in our `campground` object, we will then display the title and the location of it to test it out. This will be in our `show.ejs` file

```html
<body>
    <h1><%= campground.title %> </h1>
    <h2><%= campground.location %> </h2>
</body>
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img10.jpg?raw=true)

## 8. Campground New & Create

### 8.1 Making Our Form and GET Route

We will need to have two routes to create a new campground: GET and POST. Let's set up our route and create a `new.ejs` file

```js
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
```

```html
<form action="/campgrounds" method="post">
    <div>
        <label for="title">Title</label>
        <input type="text" name="campground[title]" id="title">
    </div>
    <div>
        <label for="location">Location</label>
        <input type="text" name="campground[location]" id="location">
    </div>
    <button>App Campground</button>
</form>
```

Notice the value of `name`. We have it like this because when we make a POST request, everything from `req.body` will be stored inside of the `campground`. It's a nice way to group content together 

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img11.jpg?raw=true)

Look at what's happening in the pic. We are sending a GET request, but it's not working. This is because the route is treating `new` as an ID. We have to rearrange our routes in our `app.js` file by placing the `new` route on top of the `id` route

```js
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
});
```

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img12.jpg?raw=true)

### 8.2 Making Our POST Route

So now we'll set up our endpoint where the form is submitted to

```js
app.post('/campgrounds', async(req, res) => {
    res.send(req.body);
});
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img13.jpg?raw=true)

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img14.jpg?raw=true)

We sent our request but we don't see any data. We need to tell express to use a body parser inside of our `app.js`

```js
app.use(express.urlencoded({extended: true}));
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img15.jpg?raw=true)

Let's modify our POSTroute so that it saves the campground to the DB and redirects us to its own page

```js
app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
```

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img16.jpg?raw=true)

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img17.jpg?raw=true)

### 8.3 Modifying show.ejs and new.ejs

Let's add an anchor tag to take us back to all campgrounds

```html
<footer>
    <a href="/campgrounds">All Campgrounds</a>
</footer>
```

## 9. Campground Edit & Update

### 9.1 Making Our Form and Routes

We will make some new routes and a new view called `edit.ejs` to update our campgrounds

```js
app.get('/camgrounds/:id/edit', async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
});
```

And this will be inside of our `edit.ejs`

```html
<h1>Edit Campground</h1>
<form action="/campgrounds" method="post">
    <div>
        <label for="title">Title</label>
        <input type="text" name="campground[title]" id="title">
    </div>
    <div>
        <label for="location">Location</label>
        <input type="text" name="campground[location]" id="location">
    </div>
    <button>Add Campground</button>
</form>
<a href="/campgrounds/<%= campground._id %> ">Back to Campground</a>
```

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img18.jpg?raw=true)

To improve our UX, we will have this at the bottom of our `show.ejs`

```html
<p>
    <a href="/campgrounds/<%=campground._id%>/edit">Edit</a>
</p>
<footer>
    <a href="/campgrounds">All Campgrounds</a>
</footer>
```

Now we will prepopulate our already existing camground values into the text boxes. In our `edit.ejs` form, we will use the `value` attribute 

```html
<form action="/campgrounds" method="post">
    <div>
        <label for="title">Title</label>
        <input type="text" name="campground[title]" id="title" value="<%=campground.title%>">
    </div>
    <div>
        <label for="location">Location</label>
        <input type="text" name="campground[location]" id="location" value="<%=campground.location%>">
    </div>
    <button>Update Campground</button>
</form>
```

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img19.jpg?raw=true)

### 9.2 Method Override

Remember that with HTML forms, you can only send a GET or POST request. We have to install `method-override` to use other requests with forms

`npm i method-override`

And then in our `app.js`, we will require `method-override` and will make our PUT request to test it out

```js
const methodOverride = require('method-override');
...
app.use(methodOverride('_method'));
...
app.put('/camgrounds/:id', async (req, res) => {
    res.send('IT WORKED!!!')
});
```

In our `edit.ejs` form, we will edit the `action` attribute with `/campgrounds/<%=campground._id%>?_method=PUT`

```html
<form action="/campgrounds/<%=campground._id%>?_method=PUT" method="post">
    <div>
        <label for="title">Title</label>
        <input type="text" name="campground[title]" id="title" value="<%=campground.title%>">
    </div>
    <div>
        <label for="location">Location</label>
        <input type="text" name="campground[location]" id="location" value="<%=campground.location%>">
    </div>
    <button>Update Campground</button>
</form>
```

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img20.jpg?raw=true)

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img21.jpg?raw=true)

Now that the PUT request works, we can edit the request to actually update the campground

```js
app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`/campgrounds/${campground._id}`);
});
```

For the values of the keys, we will take whatever is inputted from the form into here. Remember that inputs had names like this?

```html
<input type="text" name="campground[title]" id="title" value="<%=campground.title%>">
```

Now let's try it out

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img22.jpg?raw=true)

![img23](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img23.jpg?raw=true)

![img24](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img24.jpg?raw=true)