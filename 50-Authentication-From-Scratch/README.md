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

## 3. Cyptographic Hashing Functions

Hashing functions are a broad use of functions. There are many different kinds out there and they don't all have to do with passwords. Below is an example of a hypothetical hash function, taken from Wikipedia. It takes an input and turns it into a 2-digit number from 0 to 15. This is a very simple version that has 16 possible outputs. It doesn't matter what your username or password is; the result will be one out of the possible 16 outputs, so it wouldn't take long for someone to guess the password

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img6.jpg?raw=true)

When we talk about ***cryptographic* hashing functions**, we care about password safety. 

### 3.1 One-Way Hash Function, Which is Infeasible to Invert

It can be pretty tricky to wrap your head around this. In math, absolute value will take any number, positive or negative, and return the positive value of it. In JavaScript, `Math.abs()` is an example of a one-way function. If we pass in a variable that contains a number, the function will return the positive value of it. The thing is, we don't know if that variable is positive or negative

```js
> Math.abs(x)
< 100
```

Was the input 100 or -100? You cannot tell me definitively what the number was (it was actually -100).

### 3.2 Small Change in Input Yields Large Change in Output

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img5.jpg?raw=true)

Let's take a look at the password. If we we're to change it from 'lizard987' to 'lizard989', that should be a very large change in the output. You shouldn't be able to tell if two passwords are similar to each other just by looking at their hashed outputs. Below is an example of how slight changes in inputs yield completely different outputs

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img6.jpg?raw=true)

### 3.3 Deterministic - Same Input Yields Same Output

It would defeat the purpose of the hash function if we don't get the same output with the same input. If that happens, we can't compare the password, which is then hashed, that the user uses to log in with the one stored in the DB

### 3.4 Unlikely to Find 2 Outputs With The Same Value

When we say 'unlikely,' we mean 'very very very unlikely' but it's still possible to have a collision. Like 1 / (2^88) chance

### 3.5 Password Hash Functions are Deliberately SLOW

We want something that takes time because if we have a fast one, it'll be easy for people to brute-force their way in. Slow ones take a lot longer. There are ones that are fast, but those are not for passwords, like digital signing. 