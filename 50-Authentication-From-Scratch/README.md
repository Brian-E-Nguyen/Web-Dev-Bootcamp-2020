# Section 50: Authentication From Scratch

Most apps, or anything nowadays, have some sort of authentication. We will make our own authentication (authN) from scratch so that we get an idea how it works. It's really helpful to understand how all of the pieces fit together. This section has two parts:

1. how does authN work, how to store passwords, what it means to salt a password etc.
2. implementing authN in an Express app

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img1.jpg?raw=true)

## 1. Authentication vs. Authorization

**Authentication** is the process of verifying _who a particular user is_. We typically authenticate with a username/password combo, but we can also use security questions, facial recognition, etc.

**Authorization** is verifying what a specific user has access to. Generally, we authorize after a user has been authenticated. "Now that we know who you are, here is what you are allowed to do and what you're NOT allowed to do"

## 2. How to (not) Store Passwords

The #1 rule for storing passwords is to **never store passwords as is, as text, in your database.** That is a recipe for disaster

```js
{
    username: 'kittyluver',
    password: 'meowmeow999'
},
{
    username: 'geckoman',
    password: 'lizard932'
}
```

It doesn't matter what DB you are using: MySQL, Mongo, Postgres, etc. Imaginge this is Mongo as the password is. If anyone gets in your database, you're screwed. Not to mention thhat a lot of users reuse passwords from one app to the next. So if someone has one password, they can use that same password to access some other accounts from other apps

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img2.jpg?raw=true)

The solution for this is hashing the password. Rather than storing a password in the database, we run the password through a **hashing function** first and then store the result in the database

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img3.jpg?raw=true)

The outputs of the hashing function is always the same size

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img4.jpg?raw=true)

When someone logs in with this username and password, we run the password through the hash function that we used to store the hashed password and compare those two

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img5.jpg?raw=true)