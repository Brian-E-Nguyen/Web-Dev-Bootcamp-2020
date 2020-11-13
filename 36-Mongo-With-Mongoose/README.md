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