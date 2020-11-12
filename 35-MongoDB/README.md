# 35. Our First Database: MongoDB

## 1. Intro to Databases

According to its homepage, **MongoDB** is "the most popular database for modern applications." It is commently used in combination with Node. Mongo is a document database, which we can use to store and retrieve complex data from

### 1.1 Why Use A Database?

- databases can handle large amounts of data efficiently and store it compactly
- they provide tools for easy insertion, querying, and updating of data
- they generally offer security features and control over access to data
- they (generally) scale well

## 2. SQL vs. NoSQL Databases

There are two types of databases: SQL and NoSQL databases

### 2.1 Structured Query Languages (SQL)

**Structured Query Languages (SQL)** shares basic syntax and they are relational databases. Everything is done in preset tables before we add them in the databases. 

Let's say we make a database for a blog website with these fields:

**Posts**
| id | author | text    |
|----|--------|---------|
| 1  | b-rye  | lololol |
| 2  | brian  | hi      |
| 3  | nairb  | what    |

Every single entry in our table must be filled with data, though we can make some of the columns optional. What we can't do is add a new column of data. 

If we wanted to add a comments to our database, then the SQL way to do it is to add a new table called *Comments*

**Comments**

| id | text         |
|----|--------------|
| 1  | love it      |
| 2  | hate it      |
| 3  | what is this |
| 4  | REEEEEEEEEE  |
| 5  | :D           |

We define these individual tables, then we connect them by referencing one another often inside of different tables. In our *Comments* table, we would add a new column called `post_id` so that it references the post that each comment is associated with

**Comments**
| id | text         | post_id |
|----|--------------|---------|
| 1  | love it      | 3       |
| 2  | hate it      | 3       |
| 3  | what is this | 2       |
| 4  | REEEEEEEEEE  | 2       |
| 5  | :D           | 2       |

### 2.2 NoSQL

**NoSQL** databases do not use SQL and instead use many different types of no-sql databases, such as document, key-value, and graph-store. There are a lot to mention and there is no one single answer.

One example of NoSQL is a document-oriented database. It stores information in a file, such as XML or JSON. It is pretty slow, however

Instead of two tables for *Posts* and *Comments* we can have this

```js
[
    {
        "id": 1,
        "author": "b-rye",
        "text": "lolol"
    }
]
```

If we wanted to add another field to our database, in thise case, comments for each post, we can just add them easily

```js
[
    {
        "id": 1,
        "author": "b-rye",
        "text": "lolol",
        "comments": [
            "wat",
            "wat",
            "wat",
            "wat",
        ]
    }
]
```

We can also add a new post to this database as well. But maybe that post doesn't have any comments, but rather a different fielld


```js
[
    {
        "id": 1,
        "author": "b-rye",
        "text": "lolol",
        "comments": [
            "wat",
            "wat",
            "wat",
            "wat",
        ]
    },
     {
        "id": 2,
        "author": "brian",
        "text": "hi",
        "werwew": "78few"
    }
]
```

We have more flexibility with NoSQL, but that doesn't always mean it's better than SQL

## 3. Why We're Learning Mongo

- Mongo is very commonly used with Node and Express (MEAN & MERN stacks)
- it's easy to get started with (though it can be tricky to master)
- it plays well with JavaScript
- its popularity also means there is a strong community of devs using Mongo

[Link to MongoDB website](https://www.mongodb.com/)

## 4. Windows Installation

- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- https://www.youtube.com/watch?v=FwMwO8pXfq0

## 5. The Mongo Shell

Just like Node, Mongo has its own REPL where we can write code to test things out and to work with databases, security, administrative permissions, etc.

### 5.1 Running the Shell

For this to work, you would need to have two terminals running. Run `mongod` on one terminal first, then run `mongo` on another one. If this works, you should be greeted with this 

```
---
Enable MongoDB's free cloud-based monitoring service, which will then receive and display
metrics about your deployment (disk utilization, CPU, operation statistics, etc).

The monitoring data will be available on a MongoDB website with a unique URL accessible to you
and anyone you share the URL with. MongoDB may use this information to make product
improvements and to suggest MongoDB products and deployment options to you.

To enable free monitoring, run the following command: db.enableFreeMonitoring()
To permanently disable this reminder, run the following command: db.disableFreeMonitoring()
---
```

### 5.2 Basic Commands

#### 5.2.1 `help`

Type `help` to show different commands

```
> help
        db.help()                    help on db methods        
        db.mycoll.help()             help on collection methods
        sh.help()                    sharding helpers
        rs.help()                    replica set helpers       
        help admin                   administrative help       
        help connect                 connecting to a db help   
        help keys                    key shortcuts
        help misc                    misc things to know
        help mr                      mapreduce


...
```

The mongo shell is actually a JavaScript shell, so you are able to write JS code. You don't have access to everything, but you still have a lot of resources. The Mongo syntax is like JS's syntax

With Mongo, we can multiple databases at once. We can have a Yelp DB and a Twitter DB, but they don't have to be connected

#### 5.2.2 `show db`

When we type `db` in the shell, it shows the database that you are using by default

```
> db
test
```

You can also type `show dbs` to show all the databases you can work with

```
> show dbs
admin     0.000GB
cat_app   0.000GB
config    0.000GB
demo      0.000GB
local     0.000GB
yelpcamp  0.000GB
```

#### 5.2.3 `use <db name>`

To make a DB, use a command called `use <db name>`. We'll make a DB called `animalShelter`

```
> use animalShelter
switched to db animalShelter
```

If we were to run the `show dbs` command, we would get this:

```
> show dbs
admin     0.000GB
cat_app   0.000GB
config    0.000GB
demo      0.000GB
local     0.000GB
yelpcamp  0.000GB
```

We don't see the `animalShelter` db. Why is that? Mongo is waiting for us to insert data in it. But if we type `db`, it will show the our current `db`

## 6. What is BSON?

The problem with JSON is that it is pretty slow. The causes for this are that JSON
- is a text-based format, and text parsing is very slow
- is not space-efficient
- supports a limited number of basic data types

**Binary JSON (BSON)** is a more compact version of JSON. We can write JSON, but Mongo will store the data as binary

```
{"hello": "world"} →
\x16\x00\x00\x00           // total document size
\x02                       // 0x02 = type String
hello\x00                  // field name
\x06\x00\x00\x00world\x00  // field value
\x00                       // 0x00 = type EOO ('end of object')

{"BSON": ["awesome", 5.05, 1986]} →
 \x31\x00\x00\x00
 \x04BSON\x00
 \x26\x00\x00\x00
 \x02\x30\x00\x08\x00\x00\x00awesome\x00
 \x01\x31\x00\x33\x33\x33\x33\x33\x33\x14\x40
 \x10\x32\x00\xc2\x07\x00\x00
 \x00
 \x00
```

|          | JSON         | BSON   |
|----------|--------------|--------|
| **Encoding** | UTF-8 String | Binary |
| **Data Support** | String, Boolean, Number, Array | String, Boolean, Number (Integer, Float, Long, Decimal128...), Array, Date, Raw Binary |
| **Readability** | Human and Machine | Machine Only |


## 7. Inserting With Mongo

### 7.1 Intro

What we will focus on in the next few sections are CRUD operations, starting with insertion

Link to the docs: https://docs.mongodb.com/manual/crud/

The way that this works is that we insert into a collection. A **collection** is a grouping of data in a database. We will work with our `animalShelter` database (remember to run `use animalShelter` command). Let's use `dogs` as our first collection to begin with to insert data into. The good thing with Mongo is that if we insert something into a nonexistent collection, that collection will be made for us

For insertion, we have three different methods:

- `db.collection.insertOne()` - Inserts a single document into a collection.
- `db.collection.insertMany()` - Inserts *multiple* documents into a collection
- `db.collection.insert()` - Inserts a single document or multiple documents into a collection.

These methods take in an object as a parameter so that we can insert into the collection

```
> db.dogs.insert({name: "Charlie", age: 3, breed: "corgi", catFriendly: true})
WriteResult({ "nInserted" : 1 })
```

### 7.2 Viewing Our Data

We can tell if this from the `WriteResult` statement, or that since we create a new collection, we can run `show collections`

```
> show collections
dogs
```

If we wanted to see all dogs, we can run this command

```
> db.dogs.find()
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 3, "breed" : "corgi", "catFriendly" : true }
```

The `_id` is the primary key for each object, and it is unique for each data. 

Let's now work with `db.collection.insert()`, which can pass in an array of objects as a parameter. We don't have to enforce any consitent structure for our DB. Our other dog had a name, breed, etc. We can add all of those in our data, but for now we'll ignore that

```
> db.dogs.insert([{name: "Wyatt", breed: "Golden", age: 14, catFriendly: false}, {name: "Tanya", breed: "Pom", age: 2, catFriendly: true}])
BulkWriteResult({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 2,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 0,
        "upserted" : [ ]
})
```

```
> db.dogs.find()
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 3, "breed" : "corgi", "catFriendly" : true }
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true }
```

Let's create a new `cats` collection and insert into it to make sure that each collection is separate from one another

```
> db.cats.insert({name: "Blue", age: 6, dogFriendly: false, breed: "Scottish Fold"})
WriteResult({ "nInserted" : 1 })
```

```
> db.cats.find()
{ "_id" : ObjectId("5fac3451a3099aa679f64683"), "name" : "Blue", "age" : 6, "dogFriendly" : false, "breed" : "Scottish Fold" }

> db.dogs.find()
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 3, "breed" : "corgi", "catFriendly" : true }
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true }
```

## 8. Finding With Mongo

We are starting with a familiar method: `db.collection.find()`. We only seen how to use it w/o any arguments, and it will return every document in a collection. A lot of the times we are trying to find a certain criteria, like find all dogs that are corgis. We would pass in an object that will act like a query into the `find()` method

```
> db.dogs.find({breed: "corgi"})
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 3, "breed" : "corgi", "catFriendly" : true }
```

Another example:

```
> db.dogs.find({catFriendly: true})   
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 3, "breed" : "corgi", "catFriendly" : true }
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true }
```

Note that the query is case-sensitive, and note that queries can return 0, 1, or more than 1 result.

We can also pass in multiple queries to get more specific results

```
> db.dogs.find({catFriendly: true, age: 2}) 
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true }
```

## 9. Updating With Mongo

### 9.1 Intro

Updating is tedious because first we need to find what we want to update then specify how to update it. In our `dogs` collection, let's update Charlie's age

```
> db.dogs.find()
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 3, "breed" : "corgi", "catFriendly" : true }
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true }
```

We have many different update methods that we can use:

- `db.collection.updateOne(<filter>, <update>, <options>)`
- `db.collection.updateMany(<filter>, <update>, <options>)`
- `db.collection.replaceOne(<filter>, <update>, <options>)`

A cool trick with Mongo is that you can use the Tab key when writing your code so that it can auto update it

### 9.2 updateOne

The thing with Mongo is that it isn't as simple as writing this query:

```
> db.dogs.updateOne({name: 'Charlie'}, {age: 4})

2020-11-11T11:28:46.739-0800 E  QUERY    [js] uncaught exception: Error: the update operation document must contain atomic operators :
DBCollection.prototype.updateOne@src/mongo/shell/crud_api.js:565:19
@(shell):1:1
```

Mongo has special operators for updating. The most common one is `$set`, which has the following form:

```
{ $set: { <field1>: <value1>, ... } }
```

It is used to replace a value with a new value. All of these operators start with `$`.

```
> db.dogs.updateOne({name: 'Charlie'}, {$set: {age: 4}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.dogs.find({age: 4})
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 4, "breed" : "corgi", "catFriendly" : true }
```

We can also pass in many fields to update

```
> db.dogs.updateOne({name: 'Charlie'}, {$set: {age: 5, breed: "Pom"}})
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.dogs.find({age: 5})
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 5, "breed" : "Pom", "catFriendly" : true }
```

What if we set something that is not in the matched document? Charlie doesn't have a color, so let's try that

```
> db.dogs.updateOne({name: 'Charlie'}, {$set: {color: "chocolate"}})  
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.dogs.find({age: 5})
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 5, "breed" : "Pom", "catFriendly" : true, "color" : "chocolate" }
```

Now Charlie has a new key-value pair of `color`, which is chocolate

### 9.3 updateMany()

We will now work with `updateMany()` with this example, which will update documents that applies to the queries

```
> db.dogs.updateMany({catFriendly: true}, {$set: {isAvailable: false}})

> db.dogs.updateMany({catFriendly: true}, {$set: {isAvailable: false}})
{ "acknowledged" : true, "matchedCount" : 2, "modifiedCount" : 2 }

> db.dogs.find()
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 5, "breed" : "Pom", "catFriendly" : true, "color" : "chocolate", "isAvailable" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true, "isAvailable" : false }
```

This is saying for all dogs that have the attribute of `catFriendly` to `true`, set `isAvailable` to `false`. Notice for Charlie and Tanya that they have `isAvailable` to `false`, so we added two new key-value pairs to those documents

## 10. Deleting With Mongo

Deleting with Mongo is simple. We have two methods we can use

- `db.collection.deleteMany()`
- `db.collection.deleteOne()`

### 10.1 deleteOne()

```
> db.cats.find()    
{ "_id" : ObjectId("5fac3451a3099aa679f64683"), "name" : "Blue", "age" : 7, "dogFriendly" : false, "breed" : "Scottish Fold", "lastChanged" : ISODate("2020-11-12T18:55:11.565Z") }

> db.cats.deleteOne({name: 'Blue'})
{ "acknowledged" : true, "deletedCount" : 1 }

> db.cats.find()
>
```

### 10.2 deleteMany()

```
> db.dogs.find()
{ "_id" : ObjectId("5fac31eaa3099aa679f64680"), "name" : "Charlie", "age" : 5, "breed" : "Pom", "catFriendly" : true, "color" : "chocolate", "isAvailable" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
{ "_id" : ObjectId("5fac33b0a3099aa679f64682"), "name" : "Tanya", "breed" : "Pom", "age" : 2, "catFriendly" : true, "isAvailable" : false }

> db.dogs.deleteMany({isAvailable: false})
{ "acknowledged" : true, "deletedCount" : 2 }

> db.dogs.find()
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
```

To delete an entire collection, use `db.collection.deleteMany({})`

```
> db.dogs.find()
{ "_id" : ObjectId("5fac33b0a3099aa679f64681"), "name" : "Wyatt", "breed" : "Golden", "age" : 14, "catFriendly" : false }
{ "_id" : ObjectId("5fad87ce3b35da6a1b74a37f"), "feuj" : 223, "342erw" : 34333 }

> db.dogs.deleteMany({})
{ "acknowledged" : true, "deletedCount" : 2 }
```

## 11. Additional Mongo Operators

Link to query operators official document
- https://docs.mongodb.com/manual/reference/operator/query/

---

```
db.dogs.insert([
    {name: 'Rusty', breed: 'Mutt', age: 3, weight: 25, size: 'M', personality: {catFriendly: true, childFriendly: true}},
    {name: 'Mimi', breed: 'Pom', age: 15, weight: 25, size: 'L', personality: {catFriendly: false, childFriendly: false}},
    {name: 'Mimi', breed: 'Pom', age: 14, weight: 10, size: 'M', personality: {catFriendly: false, childFriendly: false}},
    {name: 'Alfred', breed: 'Golden', age: 10, weight: 5, size: 'S', personality: {catFriendly: true, childFriendly: true}},
    {name: 'Rex', breed: 'Chihuahua', age: 17, weight: 5, size: 'S', personality: {catFriendly: true, childFriendly: true}},
    {name: 'Brian', breed: 'Husky', age: 5, weight: 20, size: 'L', personality: {catFriendly: false, childFriendly: true}},
])
```

What if we want to find dogs that are between certain ages? Or their weight is less than something? Or dogs that are large or small?

```
> db.dogs.findOne({age: 10})
{
        "_id" : ObjectId("5fad8a513b35da6a1b74a387"),
        "name" : "Alfred",
        "breed" : "Golden",
        "age" : 10,
        "weight" : 5,
        "size" : "S",
        "personality" : {
                "catFriendly" : true,
                "childFriendly" : true
        }
}
```

If we wanted to find dogs where childfriendly is true, it's a bit complicated. That value is nested inside of `personality`

```
> db.dogs.find({childFriendly: true})
>
```

In order to access it, we would have to use dot notation

```
> db.dogs.find({'personality.childFriendly': true})
{ "_id" : ObjectId("5fad8a513b35da6a1b74a384"), "name" : "Rusty", "breed" : "Mutt", "age" : 3, "weight" : 25, "size" : "M", "personality" : { "catFriendly" : true, "childFriendly" : true 
} }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a387"), "name" : "Alfred", "breed" : "Golden", "age" : 10, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a388"), "name" : "Rex", "breed" : "Chihuahua", "age" : 17, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a389"), "name" : "Brian", "breed" : "Husky", "age" : 5, "weight" : 20, "size" : "L", "personality" : { "catFriendly" : false, "childFriendly" : true } }
```

We can also be more specific with our query as well

```
> db.dogs.find({'personality.childFriendly': true, size: 'M'})
{ "_id" : ObjectId("5fad8a513b35da6a1b74a384"), "name" : "Rusty", "breed" : "Mutt", "age" : 3, "weight" : 25, "size" : "M", "personality" : { "catFriendly" : true, "childFriendly" : true 
} }
```

What if we want to find dogs that are between certain ages? Or their weight is less than something? Or dogs that are large or small?

### 11.1 $gt, $gte, $lt, $lte

-`$gt` - greater than

-`$gte` - greater than or equal to

-`$lt` - less than

-`$lte` - less than or equal to

```
> db.dogs.find({age: {$gt: 8}})
{ "_id" : ObjectId("5fad8a513b35da6a1b74a385"), "name" : "Mimi", "breed" : "Pom", "age" : 15, "weight" : 25, "size" : "L", "personality" : { "catFriendly" : false, "childFriendly" : false } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a386"), "name" : "Mimi", "breed" : "Pom", "age" : 14, "weight" : 10, "size" : "M", "personality" : { "catFriendly" : false, "childFriendly" : false } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a387"), "name" : "Alfred", "breed" : "Golden", "age" : 10, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a388"), "name" : "Rex", "breed" : "Chihuahua", "age" : 17, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
```

### 11.2 $in

The `$in` operator selects documents based upon some value that's inside an array

```
> db.dogs.find({breed: {$in: ['Pom', 'Golden']}}) 
{ "_id" : ObjectId("5fad8a513b35da6a1b74a385"), "name" : "Mimi", "breed" : "Pom", "age" : 15, "weight" : 25, "size" : "L", "personality" : { "catFriendly" : false, "childFriendly" : false } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a386"), "name" : "Mimi", "breed" : "Pom", "age" : 14, "weight" : 10, "size" : "M", "personality" : { "catFriendly" : false, "childFriendly" : false } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a387"), "name" : "Alfred", "breed" : "Golden", "age" : 10, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
```

### 11.3 $or

`$or` passes in multiple arguments and finds documents based on one or more of those arguments

```
> db.dogs.find({$or: [{'personality.catFriendly': true}, {age: {$lte: 10}}]}) 
{ "_id" : ObjectId("5fad8a513b35da6a1b74a384"), "name" : "Rusty", "breed" : "Mutt", "age" : 3, "weight" : 25, "size" : "M", "personality" : { "catFriendly" : true, "childFriendly" : true 
} }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a387"), "name" : "Alfred", "breed" : "Golden", "age" : 10, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a388"), "name" : "Rex", "breed" : "Chihuahua", "age" : 17, "weight" : 5, "size" : "S", "personality" : { "catFriendly" : true, "childFriendly" : true } }
{ "_id" : ObjectId("5fad8a513b35da6a1b74a389"), "name" : "Brian", "breed" : "Husky", "age" : 5, "weight" : 20, "size" : "L", "personality" : { "catFriendly" : false, "childFriendly" : true } }
```