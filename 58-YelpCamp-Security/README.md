# Section 58 - YelpCamp: Common Security Issues

This section will focus on security issues and how to address them (or at least attempt to address them). Security is a topic that could be a 40-50 hour course, and it's a really complicated topic; we won't be able to hit all of the points, but rather basic issues

## 1. Mongo Injection

### 1.1 Intro to SQL Injection

The first thing we will talk about is SQL injection. It refers to a common SQL exploit where a SQL query that uses some part of user's input to form the query. For example, when a user is doing a search with a search field, the user can type something in there and use that search field to populate that query. The way SQL injection works is that it takes advantage of SQL syntax. Below is an example:

```sql
statement = " SELECT * FROM users WHERE name = ' " + userName + " '; "
```

You are putting a username in that query and that's what is being searched in the DB. A basic SQL attack is when a user doesn't enter an actual username, but rather their own query. Below is an example:

```sql
SELECT * FROM users WHERE name = 'a';DROP TABLE users; SELECT * FROM userinfo WHERE 't' = 't';
```

Mongo is also prone to injections, not just SQL databases. One example of an injection is this code below:

```
db.users.find({username: req.body.username})
db.users.find({username: 'tim'})

> db.users.find({username: 'tim'})
{ "_id" : ObjectId("6014644ae18c19056071bdb6"), "email" : "tim@gmail.com", "username" : "tim", "salt" : "2b618460a1e26e794555d10d71aa9371ca323f6af3fb972bdd6501b9a8ee5539", "hash" : "6d7975090b7e18aa87be4bc13c045292d1d111eadcf38a017ca7fed7b6a48db87aa7998500938f4c53a2234b607c5acab09649046ce0518b14bef4334523fd83eec82bbd0cc0d4cef4aa578c7fa95b9321efbb7923cac616e8d12145998ccd3c1828a0cca2124960372b8bf75d348254bbe0f89cb7b4fd4bdadf7074f84308093fbab8456738b805bbf6e6a79733707dad5862d2e09ac5daddbcbbcac83afcc0d9890687252e2934e15907a99ae01ff90402b509c19031f3de3472b19ad1177107cb9bda19493504b48d4238440283fb7feea679017e900dd9d7c84af883a91ada4f00ec537ce1d00f5f948be2cf40b52823870c272d7a6d0e4318c0f376c185f12d88b3a4ac9f04614da71e1579e3b1fe721db64a027a2086926e114a314b262b1ac4a55ecce9a2d50f6a9892339fe0e5d01da8c46f54cef47ffa590ea54e444b5c69b31228dec922d02ce14301733619cbe93d2358b23ba23a29a2f1ef45997ddb9a2383ae57c45f87bf6b9aa0cbf7de9d00a626d1bc57d4ec2810235a9137dab6c06bbc6dcb5201f05aa91a1c140e316003968ede4159b57d8d7a3dc869f8e6adb1bcc1d52f6a0763cb2243052a43c6c9d0bfc4beb1cdbd206b84fa1122ebe2cfa84dab160db41941859f184928b396a9584d3ccc1394050e6b1443cc8976c2a6192bec994cfed6032f3ea0e6fe1688ba735290d0f98f48d63da2ef3ce35a", "__v" : 0 }
```

Right now the user is finding `tim` with their query. If a user enters something more devious, then bad things can happen. One example is this below:

```
{"$gt": ""}
```

Remember that `gt` means "greater than". If we replaced `tim` with that, it's saying "find all users with a username that's greater than nothing." All usernames in our DB are greater than an empty string, which is always true

```
> db.users.find({username: {"$gt": ""}})
```

### 1.2 Express Mongo Sanitize

This will then return all users to the attacker. All we need to do to address this basic level of attack is not allow users to have dollar signs and periods in their search queries. There's a package that helps us do that called _Express Mongo Sanitize_. This module searches for any keys in objects that begin with a $ sign or contain a ., from `req.body`, `req.query` or `req.params`. It can then either:

- completely remove these keys and associated data from the object, or
- replace the prohibited characters with another allowed character.

Let's install that package with `npm i express-mongo-sanitize`. Then, inside of our `app.js`, let's print out our search query

```js
// app.js
app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
```

Right now, no sanitization is taking place. If we make our own request with a dollar sign, this will show up in our console:

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img1.jpg?raw=true)

```
{ '$gt': 'rgkmergmgre' }
```

All we need to do to fix this is include Express Mongo Sanitize

```js
// app.js
const mongoSanitize = require('express-mongo-sanitize');
...
app.use(mongoSanitize());
```

So now when we send the exact same request, our `req.query` is empty. We can also replace the $ symbol with another one

```js
app.use(mongoSanitize({
    replaceWith: '_'
}));
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img3.jpg?raw=true)