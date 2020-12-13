# Section 44: Data Relationships With Mongo

## 1. Introduction to Mongo Relationships

When we say relationships with data, we have lots of different entities that we are storing data. Below is an example of Facebook's database in its early days. This is only a tiny fraction of what Facebook stores today. These data are connected in a different ways

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/44-Data-Relationships/44-Data-Relationships/img-for-notes/img1.jpg?raw=true)

In this section, we are using Mongo to see how we can model different relationships and what are the patterns we can use

## 2. SQL Relationships Overview

To recap relational databases, like MySQL, Postgres, MSSQL, we are storing data in tables and we have a strict schema. But we can model relationships by referencing one table to another, or by creating a new relationship table

### 2.1 One to Many

Here we have an example of an _Accounts_ table

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/44-Data-Relationships/44-Data-Relationships/img-for-notes/img2.jpg?raw=true)


Let's say that we are creating an app where a user can have many posts tied to their account, just like Reddit. We would create another table for posts. `user_id` would be a reference to `id` in the _User_ table. This is an example of a 1 to many relationship

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/44-Data-Relationships/44-Data-Relationships/img-for-notes/img3.jpg?raw=true)

One downside of having relational databases is what if we need to add new fields to one of the tables? Say for example, first name and last name. Then when a certain user makes a post, then it would have to store the user's first and last name every time. That could be a pain. Plus it makes no sense to post them

### 2.2 Many to Many

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/44-Data-Relationships/44-Data-Relationships/img-for-notes/img4.jpg?raw=true)

Supposed we want to store who was in each movie. To do that, we would need another table. One movie can have many actors, and one actor can be in many movies

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/44-Data-Relationships/44-Data-Relationships/img-for-notes/img5.jpg?raw=true)


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