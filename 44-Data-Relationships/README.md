# Section 44: Data Relationships With Mongo

## 1. Introduction to Mongo Relationships

When we say relationships with data, we have lots of different entities that we are storing data. Below is an example of Facebook's database in its early days. This is only a tiny fraction of what Facebook stores today. These data are connected in a different ways

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/44-Data-Relationships/img-for-notes/img1.jpg?raw=true)

In this section, we are using Mongo to see how we can model different relationships and what are the patterns we can use

## 2. SQL Relationships Overview

To recap relational databases, like MySQL, Postgres, MSSQL, we are storing data in tables and we have a strict schema. But we can model relationships by referencing one table to another, or by creating a new relationship table

### 2.1 One to Many

Here we have an example of an _Accounts_ table

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/44-Data-Relationships/img-for-notes/img2.jpg?raw=true)


Let's say that we are creating an app where a user can have many posts tied to their account, just like Reddit. We would create another table for posts. `user_id` would be a reference to `id` in the _User_ table. This is an example of a 1 to many relationship

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/44-Data-Relationships/img-for-notes/img3.jpg?raw=true)

One downside of having relational databases is what if we need to add new fields to one of the tables? Say for example, first name and last name. Then when a certain user makes a post, then it would have to store the user's first and last name every time. That could be a pain. Plus it makes no sense to post them

### 2.2 Many to Many

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/44-Data-Relationships/img-for-notes/img4.jpg?raw=true)

Supposed we want to store who was in each movie. To do that, we would need another table. One movie can have many actors, and one actor can be in many movies

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/44-Data-Relationships/img-for-notes/img5.jpg?raw=true)


This is common in relational databases, where we would have to create another table to reference two or more tables. There's nothing wrong with this approach, but with NoSQL databases, we have more flexibility with relationships. This is **NOT** to say that NoSQL is better than SQL

## 3. One to Few

### 3.1 Basics

We will be primarily focusing on "one to manies", where it is very common in web development. The first thing we will discuss is **one to few**. This is a relatively simple relationship scheme. In this example, Tommy Cash has a few addresses associated with him. A real life example would be like on Amazon, where you have one to few addresses saved to your account so that Amazon can ship your package to any one of your addresses. It's highly unlikely that a user will have many or more addresses. We can store them directly in the same account as the user; we don't need to store them in their own model or collection

```js
{
    name: 'Tommy Cash',
    savedAddresses: [
        { street: 'Rahukohtu 3', city: 'Tallinn', country: 'Estonia'},
        { street: 'Ravala 5', city: 'Tallinn', country: 'Estonia'},
    ]
}
```

### 3.2 Making Our User Model

Let's test this relationship out ourselves.

1. `npm init -y`
2. `npm i mongoose`
3. `code Models/user.js`
4. Paste the bottom code in `user.js`

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/relationshipDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });
```

And then we will define our user schema 

```js
// user.js
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            country: {
                type: String,
                required: true
            }
        }
    ]
});
```

### 3.3 Creating Our User

Finally we will make a function to create a user and save it to our DB

```js
// user.js
const makeUser = async () => {
    const user = new User({
        firstName: 'Harry',
        lastName: 'Potter'
    });
    user.addresses.push({
        street: '123 Sesame Street',
        city: 'New York',
        state: 'New York',
        country: 'USA'
    })
    const result = await user.save();
    console.log(result);
}

makeUser();
```

```
$ node Models/user.js
CONNECTION OPEN!!!
{
  _id: 5fd672aa57011b3e4014084b,
  firstName: 'Harry',
  lastName: 'Potter',
  addresses: [
    {
      _id: 5fd672aa57011b3e4014084c,
      street: '123 Sesame Street',
      city: 'New York',
      state: 'New York',
      country: 'USA'
    }
  ],
  __v: 0
}
```

Notice that our address has an ID. We didn't specify it an ID, but Mongoose treats the address as its own embedded schema. We can specify it like this:

```js
addresses: [
        {
            _id: {id: false},
            ...
        }
```

```
$ node Models/user.js
CONNECTION OPEN!!!
{
  _id: 5fd6733ad7ccc2372cecde62,
  firstName: 'Harry',
  lastName: 'Potter',
  addresses: [
    {
      street: '123 Sesame Street',
      city: 'New York',
      state: 'New York',
      country: 'USA'
    }
  ],
  __v: 0
}
```

And this is what Mongo shows us

```
> db.users.find()

{ "_id" : ObjectId("5fd672aa57011b3e4014084b"), "firstName" : "Harry", "lastName" : "Potter", "addresses" : [ { "_id" : ObjectId("5fd672aa57011b3e4014084c"), "street" : "123 Sesame Street", "city" : "New York", "state" : "New York", "country" : "USA" } ], "__v" : 0 }
{ "_id" : ObjectId("5fd6733ad7ccc2372cecde62"), "firstName" : "Harry", "lastName" : "Potter", "addresses" : [ { "street" : "123 Sesame Street", "city" : "New York", 
"state" : "New York", "country" : "USA" } ], "__v" : 0 }
```

### 3.4 Extra: Function to Add More Addresses for User

We can also have a function that will add another address for a user

```js
const addAddress = async(id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: '714 Elm Street',
        city: 'Calgary',
        state: 'Alberta',
        country: 'Canada'
    })
    const result = await user.save();
    console.log(result);
}

addAddress("5fd672aa57011b3e4014084b");
```

```
$ node Models/user.js
CONNECTION OPEN!!!
{
  _id: 5fd672aa57011b3e4014084b,
  firstName: 'Harry',
  lastName: 'Potter',
  addresses: [
    {
      _id: 5fd672aa57011b3e4014084c,
      street: '123 Sesame Street',
      city: 'New York',
      state: 'New York',
      country: 'USA'
    },
    {
      street: '714 Elm Street',
      city: 'Calgary',
      state: 'Alberta',
      country: 'Canada'
    }
  ],
  __v: 1
}
```

## 4. One to Many

We saw an example of a **one to many** relationship in the previous section, but we are calling it **one to few** because the structure where we are embedding a subdocument is relatively small. 

One to many is when we have a medium-sized data approach. In this, we don't directly embed data in our parent document. Instead we store it somewhere else

```js
{
    farmName: 'Full Belly Farms',
    location: 'Guinda, CA',
    produce: [
        ObjectId('393710068367'),
        ObjectId('127077426675'),
        ObjectId('439568144127'),
    ]
}
```

### 4.1 Products Model

Let's make a new file called `farm.js` in our _Models_ directory and define our child model _products_

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/relationshipDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
});

const Product = mongoose.model('Product', productSchema);

Product.insertMany([
    {name: 'Goddess Melon', price: 4.99, season: 'Summer'},
    {name: 'Sugar Baby Watermelon', price: 4.99, season: 'Summer'},
    {name: 'Asparagus', price: 3.99, season: 'Spring'},
]);
```

```
> db.products.find()
{ "_id" : ObjectId("5fd6800d3aebdb43b8d47994"), "name" : "Goddess Melon", "price" : 4.99, "season" : "Summer", "__v" : 0 }
{ "_id" : ObjectId("5fd6800d3aebdb43b8d47995"), "name" : "Sugar Baby Watermelon", "price" : 4.99, "season" : "Summer", "__v" : 0 }
{ "_id" : ObjectId("5fd6800d3aebdb43b8d47996"), "name" : "Asparagus", "price" : 3.99, "season" : "Spring", "__v" : 0 }
```

### 4.2 Farm Model

The next thing we will set up is our farm model so that it will reference our products model. The way this works is that we don't reference product ID by a string. Model comes with its own type called `ObjectID`

The most important key is `ref`. This tells Mongoose what model to use.

```js
const mongoose = require('mongoose');
const {Schema} = mongoose;
...
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

const Farm = mongoose.model('Farm', farmSchema);
```

Now let's make a function to create and save a farm

```js

const makeFarm = async() => {
    const farm = new Farm({
        name: 'Full Belly Farms',
        city: 'Guinda, CA'
    });
    const melon = await Product.findOne({name: 'Goddess Melon'});
    farm.products.push(melon);
    console.log(farm)
}

makeFarm();
```

Now you may think pushing the melon into products would be problematic since you are pushing an entire product since we have this in our farm schema

```js
const farmSchema = new Schema({
    name: String,
    city: String,
    // this part
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});
```

But let's try it out by console logging it

```
$ node Models/farm.js
CONNECTION OPEN!!!
{
  products: [
    {
      _id: 5fd6800d3aebdb43b8d47994,
      name: 'Goddess Melon',
      price: 4.99,
      season: 'Summer',
      __v: 0
    }
  ],
  _id: 5fd683d547b84f2c1032efcd,
  name: 'Full Belly Farms',
  city: 'Guinda, CA'
}
```

It looks like we push the entire product, but this is just a behavior from mongoose. Let's take a look at Mongo. We are only saving the ObjectID

```
> db.farms.find()
{ "_id" : ObjectId("5fd6843b20ed672164c11a98"), "products" : [ ObjectId("5fd6800d3aebdb43b8d47994") ], "name" : "Full Belly Farms", "city" : "Guinda, CA", "__v" : 0 
}
```

### 4.3 Extra: Adding Product to Farm


```js
const addProduct = async () => {
    const farm = await Farm.findOne({name: 'Full Belly Farms'});
    const watermelon = await Product.findOne({name: 'Sugar Baby Watermelon'});
    farm.products.push(watermelon);
    await farm.save();
    console.log(farm)
}

addProduct();
```

```
> db.farms.find()
{ "_id" : ObjectId("5fd6843b20ed672164c11a98"), "products" : [ ObjectId("5fd6800d3aebdb43b8d47994"), ObjectId("5fd6800d3aebdb43b8d47995") ], "name" : "Full Belly Farms", "city" : "Guinda, CA", "__v" : 1 }
```

## 5. Mongoose Populate

Let's see what happens when we run this code

```js
Farm.findOne({name: 'Full Belly Farms'}).then(farm => console.log(farm))
```

```
$ node Models/farm.js
CONNECTION OPEN!!!
{
  products: [ 5fd6800d3aebdb43b8d47994, 5fd6800d3aebdb43b8d47995 ],
  _id: 5fd6843b20ed672164c11a98,
  name: 'Full Belly Farms',
  city: 'Guinda, CA',
  __v: 1
}
```

We have the products array where we have the ID's. Often what we want is the data filled in for us, to take the ID's and fetch the product details, and then fill it in the array. This is where the `ref` keyword comes in from our `farmSchema`

```js
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});
```

The `ref` keyword allows us to call a method called `populate`, Mongoose will take the ID that has been stored in our array and replace them with the products' details. Let's add that method and test it out

```js
Farm.findOne({name: 'Full Belly Farms'})
    .populate('populate')
    .then(farm => console.log(farm))
```

```
$ node Models/farm.js
CONNECTION OPEN!!!
{
  products: [
    {
      _id: 5fd6800d3aebdb43b8d47994,
      name: 'Goddess Melon',
      price: 4.99,
      season: 'Summer',
      __v: 0
    },
    {
      _id: 5fd6800d3aebdb43b8d47995,
      name: 'Sugar Baby Watermelon',
      price: 4.99,
      season: 'Summer',
      __v: 0
    }
  ],
  _id: 5fd6843b20ed672164c11a98,
  name: 'Full Belly Farms',
  city: 'Guinda, CA',
  __v: 1
}
```

Now we have our `products` array to contain all of our individual products

## 6. One to "Bajillions"

When you have lots of child classes or many associations to a thing, we would store a reference to the parent on the child document. This is a contrast to one-to-many, where we would store the children on parent documents.

Doing this is similar to what we have seen, where we would use `ref`

```js
{
    tweetText: 'i just crashed my car because i was tweeting. can i get some POGGERS in the chat?',
    tags: ['stupid', 'omegalul'],
    user: ObjectId('49815649201')
}
```

### 6.1 Defining Schemas

Let's make a new file called `tweet.js` in our _Models_ directory and define our schemas

```js
const userSchema = new Schema({
    username: String,
    age: Number
});

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);
```

### 6.2 Populating Our DB

Then we will have a function to populate our DB. Note that in our farm example, we can push an entire product into a farm, but mongoose would just store the ID

```js
const makeTweets = async () => {
    const user = new User({username: 'nairb322', age: 61});
    const tweet1 = new Tweet({text: 'i luv my chicken fam', likes: 0});
    tweet1.user = user;
    user.save();
    tweet1.save();
}

makeTweets();
```

```
> db.tweets.find()

{ "_id" : ObjectId("5fd7c2150517b548e4dda2cd"), "text" : "i luv my chicken fam", "likes" : 0, "user" : ObjectId("5fd7c2150517b548e4dda2cc"), "__v" : 0 }
```

And in this example, we are storing the user's ObjectId. Let's try adding another tweet to the user

```js
const makeTweets = async () => {
    // const user = new User({username: 'nairb322', age: 61});
    const user = await User.findOne({username: 'nairb322'});
    const tweet2 = new Tweet({text: 'REEEEEEEE', likes: 9999});
    // storing the entire user
    tweet2.user = user;
    // user.save();
    tweet2.save();
}

makeTweets();
```

```
> db.tweets.find()

{ "_id" : ObjectId("5fd7c2150517b548e4dda2cd"), "text" : "i luv my chicken fam", "likes" : 0, "user" : ObjectId("5fd7c2150517b548e4dda2cc"), "__v" : 0 }
{ "_id" : ObjectId("5fd7c2d69d7c821d38aa89ff"), "text" : "REEEEEEEE", "likes" : 9999, "user" : ObjectId("5fd7c2150517b548e4dda2cc"), "__v" : 0 }
```

Both of the tweets have a reference to the ObjectId

### 6.3 Querying 

Let's try this querying function out to see what we get

```js
const findTweet = async () => {
    const tweet = await Tweet.findOne({});
    console.log(tweet);
}

findTweet();
```

```
$ node Models/tweet.js
CONNECTION OPEN!!!
{
  _id: 5fd7c2150517b548e4dda2cd,
  text: 'i luv my chicken fam',
  likes: 0,
  user: 5fd7c2150517b548e4dda2cc,
  __v: 0
}
```

When we are querying our DB from Mongoose to find tweets, we can populate the user using the `populate` function. **IMPORTANT:** the parameter passed in is the name of the _field_ in our `tweetSchema`, not the name of the model

```js
const findTweet = async () => {
    const tweet = await Tweet.findOne({})
        .populate('user');
    console.log(tweet);
}

findTweet();
```

```
$ node Models/tweet.js
CONNECTION OPEN!!!
{
  _id: 5fd7c2150517b548e4dda2cd,
  text: 'i luv my chicken fam',
  likes: 0,
  user: {
    _id: 5fd7c2150517b548e4dda2cc,
    username: 'nairb322',
    age: 61,
    __v: 0
  },
  __v: 0
}
```

We can get even fancier by populating certain fields. In the example below, we are specifying that we only want to populate the `user` field with usernames

```js
const findTweet = async () => {
    const tweet = await Tweet.findOne({})
        .populate('user', 'username');
    console.log(tweet);
}

findTweet();
```

```
$ node Models/tweet.js
CONNECTION OPEN!!!
{
  _id: 5fd7c2150517b548e4dda2cd,
  text: 'i luv my chicken fam',
  likes: 0,
  user: { _id: 5fd7c2150517b548e4dda2cc, username: 'nairb322' },
  __v: 0
}
```

## 7. Mongo Schema Design

Official blog posts for MongoDB schema design
- https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-2
- https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-3


One key thing that it says is that we can denormalize data. What this means is that we can have duplicated data. Generally that's a big no-no in SQL databases, but it's ok in here, as long as there's a good reason to

From the official docs:

**One:** favor embedding unless there is a compelling reason not to
- comes down to usage and scale
- how are you accessing this info?
- we could directly embed all tweets for a given user inside of a user document. But does that make sense? Are you always accessing a tweet through a user?

**Two:** needing to access an object on its own is a compelling reason not to embed it

**Three:** Arrays should not grow without bound. If there are more than a couple of hundred documents on the “many” side, don’t embed them; if there are more than a few thousand documents on the “many” side, don’t use an array of ObjectID references. High-cardinality arrays are a compelling reason not to embed.
- avoid arrays without a limit on them
- don't reference other documents on the parent side. The child should be the one referencing the parent

**Four:** Don’t be afraid of application-level joins: if you index correctly and use the projection specifier (as shown in part 2) then application-level joins are barely more expensive than server-side joins in a relational database.

**Five:** Consider the write/read ratio when denormalizing. A field that will mostly be read and only seldom updated is a good candidate for denormalization: if you denormalize a field that is updated frequently then the extra work of finding and updating all the instances is likely to overwhelm the savings that you get from denormalizing.

**Six:** As always with MongoDB, how you model your data depends – entirely – on your particular application’s data access patterns. You want to structure your data to match the ways that your application queries and updates it.
