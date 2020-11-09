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
