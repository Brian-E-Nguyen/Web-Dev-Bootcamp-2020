# Section 36: Connecting To Mongo With Mongoose

## 1. What is Mongoose

Node has a Mongo driver called **Mongoose**, which is used to connect to a Mongo database. Mongoose is an **ODM**, which could mean

- Object Data Mapper
- Object Document Mapper

ODM's like Mongoose map documents coming from a database into usable JavaScript objects. Mongoose provides ways for use to model out our application data and define a schema

Basically, it helps us handle Mongo objects easier and adds on some nice features that we can create for ourselves

Link to the Mongoose website
- https://mongoosejs.com/

## 2. Connecting Mongoose to Mongo

### 2.1 Getting Set Up

Mongoose is a package that we can install. Let's make a new folder called *MongooseBasics* to install it on there. Then go into the folder and do the following:

1. `npm init -y`
2. `npm i mongoose`
3. Make an `index.js`

In our `index.js`, we will add the following code

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true});

```

Inside of the URI, 
- 27017 is one of the default port numbers that we have to use
- The `movieApp` refers to the database. If that DB doesn't exist when we run this, then it will create it. Else, it would use it.

### 2.2 Testing Our Connection

When we run `index.js` as is, nothing really shows up. The Mongoose docs recommend to add these lines of code

```js
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('CONNECTION OPEN!!!!!')
});
```

**IMPORTANT: MAKE SURE `mongod` IS RUNNING**

Now when we run `index.js`, we will get this in our console

```
$ node index.js
CONNECTION OPEN!!!!!
```

Using callbacks is a better option so that we can handle errors

### 2.3 Final Code (index.js)

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:170144447/movies', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

```

So when we use an invalid port number, we get this:

```
OH NO, ERROR!!!!
MongoParseError: Invalid port (larger than 65535) with hostname
```

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});
```

## 3. Our First Mongoose Model

The central thing that we need to understand about Mongoose is models. **Models** are JS classes that represent information in a MongoDB

The link below is to the Models document
- https://mongoosejs.com/docs/api/model.html

### 3.1 Creating the Schema

First we would need to work with schemas. **Schemas** are a mapping of different collection keys from Mongo to different types in JS. An example is down below:

```js
const blogSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
  });
```

So when we receive data from the MongoDB, we are setting data types on the different keys

Let's define our `movieSchema` to work with

```js
const movieSchema = new mongoose.model({
    title: String,
    year: Number,
    score: Number,
    rating: String
});
```

### 3.2 Creating the Model

Now let's work with our model by using `mongoose.model()`. We pass in a string containing the name of our model and after that we pass in the schema

```js
const Movie = mongoose.model('Movie', movieSchema);
```

The naming of our model is weird. We have to capitalize it and keep it singular. What Mongoose will do is make a collection for us. The name will be lowercase and plural, which will be `movies`. Now we have a model class called `Movie`. Now we can create a new movie object and pass in information

```js
const amadeus = new Movie({title: 'Amadeus', year: 1986, score: 9.2, rating: 'R'})
```

### 3.3 Viewing Our Model

To see that we have data stored into `amadeus`, run Node and then run `.load index.js`. Then type in the `amadeus` object and you should get this

```
...

Promise { <pending> }
> CONNECTION OPEN!!!
> amadeus
{
  _id: 5faee0b3a43a4549645e71b5,
  title: 'Amadeus',
  year: 1986,
  score: 9.2,
  rating: 'R'
}
```

See that `amadeus` now has an ID created. However, if we use Mongo and try to find that inside of the `moviesApp` DB, there's no data 

```
> db.movies.find()
>
```

If we want to save it to the DB, there's a method called `save()`. 

```
> amadeus.save()
Promise { <pending> }
```

Now we can see it inside of our movieApp DB

```
> db.movies.find()
{ "_id" : ObjectId("5faee0b3a43a4549645e71b5"), "title" : "Amadeus", "year" : 1986, "score" : 9.2, "rating" : "R", "__v" : 0 }
```

### 3.4 Updating Our Data (JS Side)

If we were to change the object on the JS side, let's say set score to 9.5, it wouldn't save it on the DB because it's still on the JS side. However, we can still use `.save()` and the data will update

```
> amadeus.score = 9.5
9.5
> amadeus.save()
Promise { <pending> }
```

```
> db.movies.find()
{ "_id" : ObjectId("5faee0b3a43a4549645e71b5"), "title" : "Amadeus", "year" : 1986, "score" : 9.5, "rating" : "R", "__v" : 0 }
```

### 3.5 Final Code (index.js)

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

const Movie = mongoose.model('Movie', movieSchema);
const amadeus = new Movie({title: 'Amadeus', year: 1986, score: 9.2, rating: 'R'});
```

## 4. Insert Many

### 4.1 Inserting Our Data

Mongoose gives a method, `Model.insertMany()` that works the same as the Mongo version

```js
Movie.insertMany([
    {title: 'Amadeus', year: 2001, score: 9.3, rating: 'R'},
    {title: 'Alien', year: 1979, score: 8.1, rating: 'R'},
    {title: 'Amadeus', year: 1999, score: 7.5, rating: 'PG'},
    {title: 'Stand By Me', year: 1986, score: 9.2, rating: 'R'},
    {title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13'}
])
```

This method returns a promise. We do not need to call `.save()` when we run this. We will add a callback function to see if it worked

```js
Movie.insertMany([
    {title: 'Amadeus', year: 2001, score: 9.3, rating: 'R'},
    {title: 'Alien', year: 1979, score: 8.1, rating: 'R'},
    {title: 'Amadeus', year: 1999, score: 7.5, rating: 'PG'},
    {title: 'Stand By Me', year: 1986, score: 9.2, rating: 'R'},
    {title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13'}
])
    .then(data => {
        console.log('IT WORKED');
        console.log(data)
    })
```

### 4.2 Viewing Our Data

Let's run `index.js`

```
$ node index.js
CONNECTION OPEN!!!
IT WORKED
[
  {
    _id: 5faee7cfbf3e854a347a5d3c,
    title: 'Amadeus',
    year: 2001,
    score: 9.3,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3d,
    title: 'Alien',
    year: 1979,
    score: 8.1,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3e,
    title: 'Amadeus',
    year: 1999,
    score: 7.5,
    rating: 'PG',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3f,
    title: 'Stand By Me',
    year: 1986,
    score: 9.2,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d40,
    title: 'Moonrise Kingdom',
    year: 2012,
    score: 7.3,
    rating: 'PG-13',
    __v: 0
  }
]
```

And the data does appear on the Mongo side

```
> db.movies.find()
{ "_id" : ObjectId("5faee0b3a43a4549645e71b5"), "title" : "Amadeus", "year" : 1986, "score" : 9.5, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3c"), "title" : "Amadeus", "year" : 2001, "score" : 9.3, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3d"), "title" : "Alien", "year" : 1979, "score" : 8.1, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3e"), "title" : "Amadeus", "year" : 1999, "score" : 7.5, "rating" : "PG", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 9.2, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d40"), "title" : "Moonrise Kingdom", "year" : 2012, "score" : 7.3, "rating" : "PG-13", "__v" : 0 }
```

Note that when making web apps, bulk inserts are not that common. We are just showing an example of this in action

### 4.3 Final Code (index.js)

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

const Movie = mongoose.model('Movie', movieSchema);
const amadeus = new Movie({title: 'Amadeus', year: 1986, score: 9.2, rating: 'R'});

Movie.insertMany([
    {title: 'Amadeus', year: 2001, score: 9.3, rating: 'R'},
    {title: 'Alien', year: 1979, score: 8.1, rating: 'R'},
    {title: 'Amadeus', year: 1999, score: 7.5, rating: 'PG'},
    {title: 'Stand By Me', year: 1986, score: 9.2, rating: 'R'},
    {title: 'Moonrise Kingdom', year: 2012, score: 7.3, rating: 'PG-13'}
])
    .then(data => {
        console.log('IT WORKED');
        console.log(data)
    })
```

## 5. Finding With Mongoose

### 5.1 Model.find()

Mongoose comes with many different methods for finding. For this section, we will only work with `Model.find()`. `find()` is a "thenable" object. It does not work like traditional callbacks; it's its own thing in Mongoose. If we were to do `Movie.find({})`, it would not give back the data that we want, so we need to do this below. Run `node` and `.load index.js` as usual

```
> Movie.find({}).then(data => console.log(data))
Promise { <pending> }
> [
  {
    _id: 5faee0b3a43a4549645e71b5,
    title: 'Amadeus',
    year: 1986,
    score: 9.5,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3c,
    title: 'Amadeus',
    year: 2001,
    score: 9.3,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3d,
    title: 'Alien',
    year: 1979,
    score: 8.1,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3e,
    title: 'Amadeus',
    year: 1999,
    score: 7.5,
    rating: 'PG',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d3f,
    title: 'Stand By Me',
    year: 1986,
    score: 9.2,
    rating: 'R',
    __v: 0
  },
  {
    _id: 5faee7cfbf3e854a347a5d40,
    title: 'Moonrise Kingdom',
    year: 2012,
    score: 7.3,
    rating: 'PG-13',
    __v: 0
  }
]

```

We can be specific with our queries as well

```
> Movie.find({rating: 'PG-13'}).then(data => console.log(data))
Promise { <pending> }
> [
  {
    _id: 5faee7cfbf3e854a347a5d40,
    title: 'Moonrise Kingdom',
    year: 2012,
    score: 7.3,
    rating: 'PG-13',
    __v: 0
  }
]
```

### 5.2 Model.findById()

`Model.findById()` is really common in Express apps

```
> Movie.findById('5faee0b3a43a4549645e71b5').then(m => console.log(m))
Promise { <pending> }
> {
  _id: 5faee0b3a43a4549645e71b5,
  title: 'Amadeus',
  year: 1986,
  score: 9.5,
  rating: 'R',
  __v: 0
}
```

## 6. Updating With Mongoose

### 6.1 Model.updateOne()

`Model.updateOne()` updates a document depending on the query you pass in. In our `Movies`, Amadeus movie's year, 1986, is incorrect. Let's change it to 1984

```
> Movie.updateOne({title: 'Amadeus'}, {year: 1984}).then(res => console.log(res))
Promise { <pending> }
> { n: 1, nModified: 1, ok: 1 }
```

```
> db.movies.find({title: 'Amadeus'})
{ "_id" : ObjectId("5faee0b3a43a4549645e71b5"), "title" : "Amadeus", "year" : 1984, "score" : 9.5, "rating" : "R", "__v" : 0 }
```

### 6.2 Model.updateMany()

Same concept with `Model.updateOne()`, but we are updating multiple documents a once. Let's update the movies *Amadeus* and *Stand By Me* to have scores of 10

**Data before**

```
> db.movies.find()
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3d"), "title" : "Alien", "year" : 1979, "score" : 8.1, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 9.2, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d40"), "title" : "Moonrise Kingdom", "year" : 2012, "score" : 7.3, "rating" : "PG-13", "__v" : 0 }
{ "_id" : ObjectId("5fb0290adfe236a223c5f029"), "title" : "Amadeus", "year" : 1984, "score" : 7.5, "rating" : "PG" }
```

**Making the update**

```
> Movie.updateMany({title: {$in: ['Amadeus', 'Stand By Me']}}, {score: 10}).then(res
 => console.log(res))
Promise { <pending> }
> { n: 2, nModified: 2, ok: 1 }
```

**Data after**

```
> db.movies.find()
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3d"), "title" : "Alien", "year" : 1979, "score" : 8.1, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 10, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d40"), "title" : "Moonrise Kingdom", "year" : 2012, "score" : 7.3, "rating" : "PG-13", "__v" : 0 }
{ "_id" : ObjectId("5fb0290adfe236a223c5f029"), "title" : "Amadeus", "year" : 1984, "score" : 10, "rating" : "PG" }
```

### 6.3 findOneAndUpdate() and findManyAndUpdate()

Mongoose has `findOneAndUpdate()` and `findManyAndUpdate()` does what it says, but unlike the other update methods previously mentioned, this will instead return the object after the update was applied. Let's take the score of *Iron Giant* and set it from 7.5 to 7

```
> db.movies.find({title: 'Iron Giant'})
{ "_id" : ObjectId("5fb02ca3dfe236a223c5f02a"), "title" : "Iron Giant", "year" : 1999, "score" : 7.5, "rating" : "PG" }
```

```
> Movie.findOneAndUpdate({title: 'Iron Giant'}, {score: 7.0}).then(m => console.log(
m))
Promise { <pending> }
> (node:26468) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. See: https://mongoosejs.com/docs/deprecations.html#findandmodify
{
  _id: 5fb02ca3dfe236a223c5f02a,
  title: 'Iron Giant',
  year: 1999,
  score: 7.5,
  rating: 'PG'
}
```

We get back the old version for some reason, but if we look in our DB, the score is updated

```
> db.movies.find({title: 'Iron Giant'})
{ "_id" : ObjectId("5fb02ca3dfe236a223c5f02a"), "title" : "Iron Giant", "year" : 1999, "score" : 7, "rating" : "PG" }
```

Why did it give the old version? Well that's just what Mongoose does by default; no other explanation. If we want it to return the updated version, we have to pass in an extra parameter. This will be `{new: true}`

```
> Movie.findOneAndUpdate({title: 'Iron Giant'}, {score: 7.8}, {new: true}).then(m => console.log(m))
Promise { <pending> }
> {
  _id: 5fb02ca3dfe236a223c5f02a,
  title: 'Iron Giant',
  year: 1999,
  score: 7.8,
  rating: 'PG'
}
```

The reason why we get a deprecation message is because, by default, you need to have this code:

```js
mongoose.set('useFindAndModify', false)
```

## 7. Deleting With Mongoose

### 7.1 Mode.remove()

We can use the `Model.remove()` method to remove one document. Let's remove *Amadeus*

**Data before**

```
> db.movies.find()                     
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3d"), "title" : "Alien", "year" : 1979, "score" : 8.1, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 10, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d40"), "title" : "Moonrise Kingdom", "year" : 2012, "score" : 7.3, "rating" : "PG-13", "__v" : 0 }
{ "_id" : ObjectId("5fb0290adfe236a223c5f029"), "title" : "Amadeus", "year" : 1984, "score" : 10, "rating" : "PG" }
{ "_id" : ObjectId("5fb02ca3dfe236a223c5f02a"), "title" : "Iron Giant", "year" : 1999, "score" : 7.8, "rating" : "PG" }
```

**Making the deletion**

```
> Movie.remove({title: 'Amadeus'}).then(msg => console.log(msg))
Promise { <pending> }
> (node:2524) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
{ n: 1, ok: 1, deletedCount: 1 }
```

**Data after**

```
> db.movies.find()
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3d"), "title" : "Alien", "year" : 1979, "score" : 8.1, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 10, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d40"), "title" : "Moonrise Kingdom", "year" : 2012, "score" : 7.3, "rating" : "PG-13", "__v" : 0 }
{ "_id" : ObjectId("5fb02ca3dfe236a223c5f02a"), "title" : "Iron Giant", "year" : 1999, "score" : 7.8, "rating" : "PG" }
```

Notice the deprecation warning says this:

```
DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
```

### 7.2 Model.deleteMany()

So let's use `deleteMany()`. We will delete movies that were released on or after the year 1999

```
> Movie.deleteMany({year: {$gte: 1999}}).then(res => console.log(res))
Promise { <pending> }
> { n: 2, ok: 1, deletedCount: 2 }
```

```
> db.movies.find()
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3d"), "title" : "Alien", "year" : 1979, "score" : 8.1, "rating" : "R", "__v" : 0 }
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 10, "rating" : "R", "__v" : 0 }
```

### 7.3 Model.findOneAndDelete() and Model.findManyAndDelete()

Returns the deleted object, just like the update ones

```
> Movie.findOneAndDelete({title: 'Alien'}).then(m => console.log(m))
Promise { <pending> }
> {
  _id: 5faee7cfbf3e854a347a5d3d,
  title: 'Alien',
  year: 1979,
  score: 8.1,
  rating: 'R',
  __v: 0
}
```

```
> db.movies.find()
{ "_id" : ObjectId("5faee7cfbf3e854a347a5d3f"), "title" : "Stand By Me", "year" : 1986, "score" : 10, "rating" : "R", "__v" : 0 }
```

## 8. Mongoose Schema Validations

We will create a new file called `product.js` and add the Mongoose connection to it. Our DB will be `shopApp`

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });
```

### 8.1 Operation Buffering (not related to main topic)

Let's take a look back at `index.js`. You may be wondering, how could we run the code `const Movie = mongoose.model('Movie', movieSchema);` if we don't know for sure if we have a connection? It does take time to connect. You would think that you would place it inside of the `then()` callback, but Mongoose has **operation buffering**, which allows us to start using the models we define immediately without waiting for Mongo to be connected.

### 8.2 Adding Schema Validations

Let's create a new schema inside `product.js`

```js
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
})
```

This is simple, but there's a lot more that we can define for each property. This is the shorthand way. The longer way looks like this, where each propery has an object as its value

```js
const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: number
    },
})
```

This is basically the same as the one above, but now we can define more, like some of the built-in validations that come with Mongoose, and one of those is the `required` validations

```js
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
})
```

This is saying that the name of a product *must* be there when creating a new product. The default value of `required` is always set to `false`. Let's create a new `Product` class and a new product itself

```js
const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Mountain Bike', price: 599});

bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

### 8.3 Testing Our Validations

Let's actually remove the `name` property and see what happens when we run this

```
Promise { <pending> }
> OH NO, ERROR!!!!
Error: Product validation failed: name: Path `name` is required.

...
```

If we were pass in a value as a different type, let's say pass in a String for the price, it would fail

```js
const bike = new Product({name: 'Mountain Bike', price: 'Hi'})
```

What if we passed in additional information that is not in our schema? Let's pass in `color: 'red'`

```js
const bike = new Product({name: 'Mountain Bike', price: 599, color: 'red'})
```

```
> CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  _id: 5fb17dd1217a8b623413c497,
  name: 'Mountain Bike',
  price: 599,
  __v: 0
}
```

Everything but color is there. The code or the DB didn't break, nor did it trigger the callback, but it works

### 8.4 Final Code (product.js)

```js
const mongoose = require('mongoose');
const { networkInterfaces } = require('os');
mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Mountain Bike', price: 599, color: 'red'})
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

## 9. Additonal Schema Constraints

Mongoose comes with some more schema constraints for us to use.

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/36-Mongo-With-Mongoose/img-for-notes/img1.jpg?raw=true)

Here's a link to the docs for the schema constraints
- https://mongoosejs.com/docs/schematypes.html

### 9.1 'default' Constraint

Let's modify our `productSchema` with a new property of `onSale`

```js
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    onSale: {
        type: Boolean,
        default: false
    }
})
```

The `default` key sets the default value of that property. Our `onSale` property is set to `false` by default unless we insert `true` when we create new data. Let's test this out with this data. Notice how we didn't pass in an `onSale` property

```js
const bike = new Product({name: 'Bike Helmet', price: 29.50,})
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

```
> CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  onSale: false,
  _id: 5fb18684803afd457ca894f4,
  name: 'Bike Helmet',
  price: 29.5,
  __
```

Our product has a property of `onSale` which is set to `false`. Let's look in our DB

```
> db.products.find()
{ "_id" : ObjectId("5fb17e4a4dc92b2d1c69551c"), "name" : "Mountain Bike", "price" : 599, "__v" : 0 }
{ "_id" : ObjectId("5fb18684803afd457ca894f4"), "onSale" : false, "name" : "Bike Helmet", "price" : 29.5, "__v" : 0 }
```

Let's try out more constraints. Let's set a property of `maxlength` in the `name` to be 20 and pass in a really long name

```js
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
    },
    onSale: {
        type: Boolean,
        default: false
    }
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Bike Helmet That Is Too Awesome to own', price: 29.50,})
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

```
> OH NO, ERROR!!!!
Error: Product validation failed: name: Path `name` (`Bike Helmet That Is Too Awesome to own`) is longer than the maximum allowed length (20).
```

### 9.2 Properties With Array Values

What if we wanted to set up some categories? We would set up an array of strings

```js
const bike = new Product({name: 'Bike Helmet', price: 29.50, categories: ['Cycling', 'Safety']})
```

How would we set that up? In our schema, we would do this:

```js
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String]
})
```

Let's run `product.js` and see the output

```
> CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  onSale: false,
  categories: [ 'Cycling', 'Safety' ],
  _id: 5fb1894bd5cbcd6b748d242b,
  name: 'Bike Helmet',
  price: 29.5,
  __v: 0
}
```

And now let's look at our DB

```
> db.products.find()
{ "_id" : ObjectId("5fb17e4a4dc92b2d1c69551c"), "name" : "Mountain Bike", "price" : 599, "__v" : 0 }
{ "_id" : ObjectId("5fb18684803afd457ca894f4"), "onSale" : false, "name" : "Bike Helmet", "price" : 29.5, "__v" : 0 }
{ "_id" : ObjectId("5fb1894bd5cbcd6b748d242b"), "onSale" : false, "categories" : [ "Cycling", "Safety" ], "name" : "Bike Helmet", "price" : 29.5, "__v" : 0 }
```

What if we pass in a number? It would still work, but the number will be typecasted into a string

```js
const bike = new Product({name: 'Bike Helmet', price: 29.50, categories: ['Cycling', 'Safety', 123]});
```

```
> CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  onSale: false,
  categories: [ 'Cycling', 'Safety', '123' ],
  _id: 5fb189e185364a209c7a1c41,
  name: 'Bike Helmet',
  price: 29.5,
  __v: 0
}
```

### 9.3 Nested Objects

If we have objects or nested subdocuments, we can do something like this with our new `quantity` property

```js
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    quantity: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    }
})
```

```
> CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  quantity: { online: 0, inStore: 0 },
  onSale: false,
  categories: [ 'Cycling', 'Safety', '123' ],
  _id: 5fb18aa850ae7154a8a7de67,
  name: 'Bike Helmet',
  price: 29.5,
  __v: 0
}
```

### 9.4 Final Code (product.js)

```js
const { triggerAsyncId } = require('async_hooks');
const mongoose = require('mongoose');
const { networkInterfaces } = require('os');
mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    quantity: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    }
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Bike Helmet', price: 29.50, categories: ['Cycling', 'Safety', 123]});
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

## 10. Validating Mongoose Updates

### 10.1 The Problem

So we spent all of that time setting up our schema where we have different sorts of constraints, and they're working so far, at least when we create new products. But they won't work when we update. Let's make a product that we can update

```js
const bike = new Product({name: 'Tire pump', price: 19.50, categories: ['Cycling']});
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

Now let's save it

```
> CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  quantity: { online: 0, inStore: 0 },
  onSale: false,
  categories: [ 'Cycling' ],
  _id: 5fb1c4c7ce0d745db0812262,
  name: 'Tire pump',
  price: 19.5,
  __v: 0
}
```

Let's see what happens when we set the price to negative when updating. Remember that `new: true` means that the data is shown when updating

```js
Product.findOneAndUpdate({name: 'Tire pump'}, {price: -10.99}, {new: true})
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

```
CONNECTION OPEN!!!
IT WORKED!!!
DATA: {
  quantity: { online: 0, inStore: 0 },
  onSale: false,
  categories: [ 'Cycling' ],
  _id: 5fb1c4c7ce0d745db0812262,
  name: 'Tire pump',
  price: -10.99,
  __v: 0
}
```

It still updates with the price at -10.99, even though we had the min at 0

```js
const productSchema = new mongoose.Schema({
    ...
    price: {
        type: Number,
        required: true,
        min: 0
    }
    ...
})
```

### 10.2 The Solution

Be default, Mongoose ignores our predefined validations. We would have to tell Mongoose that we waant to apply them when updating. There's an option called `runValidators` that we would need to use and set to `true`. Now when we update the product, the validator will prevent the data from updating

```js
Product.findOneAndUpdate({name: 'Tire pump'}, {price: -10.99}, {new: true, runValidators: true})
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

```
> OH NO, ERROR!!!!
Error: Validation failed: price: Path `price` (-10.99) is less than minimum allowed value (0).
```

### 10.3 Final Code (product.js)

```js
const { triggerAsyncId } = require('async_hooks');
const mongoose = require('mongoose');
const { networkInterfaces } = require('os');
mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    quantity: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    }
})

const Product = mongoose.model('Product', productSchema);

// const bike = new Product({name: 'Tire pump', price: 19.50, categories: ['Cycling']});
// bike.save()
//     .then(data => {
//         console.log('IT WORKED!!!');
//         console.log(`DATA: ${data}`);
//     })
//     .catch(err => {
//         console.log('OH NO, ERROR!!!!');
//         console.log(err);
//     })

Product.findOneAndUpdate({name: 'Tire pump'}, {price: -10.99}, {new: true, runValidators: true})
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

## 11. Mongoose Validation Errors

## 11.1 Custom Error Messages

We can set up custom validation error messages when we are using the built-in validators. In the schema below, we will pass in an array as a value where the first element is the actual value of the validator, and the second element is the custom error message

```js
const breakfastSchema = new Schema({
  eggs: {
    type: Number,
    min: [6, 'Too few eggs'],
    max: 12
  },
  ...
```

Let's try this out with one of our products

```js
const productSchema = new mongoose.Schema({
    ...
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be postive ya dofus!!']
    },
    ...
})
```

```js
Product.findOneAndUpdate({name: 'Tire pump'}, {price: -10.99}, {new: true, runValidators: true})
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

```
> OH NO, ERROR!!!!
Error: Validation failed: price: Price must be postive ya dofus!!
```

### 11.2 enum

`enum` allows us provide an array of string values to ensure that you are picking at least one of the values in that array. Let's make a new `size` property in our schema with the following sizes

```js
const productSchema = new mongoose.Schema({
    ...
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
    ...
})
```

Now, let's try inserting a product with a size of 'XS', which is not in the `enum`

```js
const bike = new Product({name: 'Cycling Jersey', price: 28.50, categories: ['Cycling'], size: 'XS'});
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })
```

```
> OH NO, ERROR!!!!
Error: Product validation failed: size: `XS` is not a valid enum value for path `size`.
```

### 11.3 Final Code (product.js)

```js
const { triggerAsyncId } = require('async_hooks');
const mongoose = require('mongoose');
const { networkInterfaces } = require('os');
mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be postive ya dofus!!']
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    quantity: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Cycling Jersey', price: 28.50, categories: ['Cycling'], size: 'XS'});
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })

// Product.findOneAndUpdate({name: 'Tire pump'}, {price: -10.99}, {new: true, runValidators: true})
//     .then(data => {
//         console.log('IT WORKED!!!');
//         console.log(`DATA: ${data}`);
//     })
//     .catch(err => {
//         console.log('OH NO, ERROR!!!!');
//         console.log(err);
//     })
```