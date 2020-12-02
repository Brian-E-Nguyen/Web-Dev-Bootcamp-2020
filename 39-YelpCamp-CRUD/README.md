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