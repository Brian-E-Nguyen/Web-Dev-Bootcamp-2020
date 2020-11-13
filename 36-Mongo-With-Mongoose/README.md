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