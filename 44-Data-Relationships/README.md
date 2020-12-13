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