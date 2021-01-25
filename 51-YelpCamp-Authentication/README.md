# Section 51 - YelpCamp: Adding In Authentication

## 1. Introduction to Passport

We will work on integrating authentication and our user model into our YelpCamp app. This will take a while, because as we've learned with authentication, it's fairly complex, but not too bad. We've got to set up plenty of routes, forms, middleware, etc. Previously, we've used _Bcrypt_ to set up our authentication, but we're not doing that here; instead, we'll be using a tool called _Passport_, which is a popular library to add authentication into Node apps. What's different about this is that it lists different strategies or ways to log someone in.

**Passport Docs**

- http://www.passportjs.org/

For YelpCamp, we will just do a basic `passport-local` login that only requires username and password. It's relatively easy, but you'll see that we have to make a decent amount of changes to a couple of files, as well as making some new files. There's a specialized libary called _Passport-Local Mongoose_ that makes everything easier

- https://github.com/jaredhanson/passport-local
- https://github.com/saintedlama/passport-local-mongoose

`> npm install passport mongoose passport-local-mongoose`