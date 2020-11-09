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

