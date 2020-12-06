# Section 41: Adding Basic Styles

## 1. A New EJS Tool For Layouts

We will have Bootstrap and include scripts and stylesheets on every page. Before we used partials to eliminate code clutter, but now we will use something that we have never seen before. There is a package called `ejs-mate`, which allows us to add fun stuff to EJS, and the one we care about is `layout`

Link to its GitHub
- https://github.com/JacksonTian/ejs-mate

This would allow us to define broilerplates where we can have code that we insert in between some content

To download it, run `npm i ejs-mate`. Then in our `app.js`, we will require ejs-mate

```js
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate);
```

Now with ejs-mate imported, we can define a layout file. In our _views_ directory, we will create a new directory called _layouts_ and add a `boilerplate.ejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BOILERPLATE!!!!</title>
</head>
<body>
    <h1>BEFORE</h1>
    <%- body %> 
    <h1>AFTER</h1>
</body>
</html>
```

On the `index.js`, we will remove almost everything and add one piece of code at the very top. This makes it so that all of the the content below will replace `<%- body %> ` in `index.ejs`

```html
<% layout('layouts/boilerplate') %> 
<h1>All Campgrounds</h1>
<ul>
    <% for( let campground of campgrounds ) { %>
        <li> <a href="/campgrounds/<%=campground._id%> "><%= campground.title %></a> </li>
    <% } %>
</ul>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img1.jpg?raw=true)


![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img2.jpg?raw=true)

This is great because we can now inject stylesheets, scripts, or other files. Let's do the same for all of our other views

**Example:** `edit.ejs`

```html
<% layout('layouts/boilerplate') %> 
<h1>Edit Campground</h1>
<form action="/campgrounds/<%=campground._id%>?_method=PUT" method="post">
    <div>
        <label for="title">Title</label>
        <input type="text" name="campground[title]" id="title" value="<%=campground.title%>">
    </div>
    <div>
        <label for="location">Location</label>
        <input type="text" name="campground[location]" id="location" value="<%=campground.location%>">
    </div>
    <button>Update Campground</button>
</form>
<a href="/campgrounds/<%= campground._id %> ">Back to Campground</a>
```

## 2. Bootstrap5! Boilerplate

### 2.1 Including Bootstrap in boilerplate.ejs

Bootstrap 5 is in alpha at the time of writing this. It no longer depends on jQuery.

Link to Bootstrap5 docs
- https://v5.getbootstrap.com/

We will start by using the CDN for now and put it in the `<head>` section of our `boilerplate.ejs`

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img3.jpg?raw=true)

We will also include these two script tags underneath the `<%- body %>` of our `boilerplate.ejs`  if we wanted to work with navbars, popups, modals, etc.

```html
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-t6I8D5dJmMXjCsRLhSzCltuhNZg6P10kE0m0nAncLUjH6GeYLhRU1zfLoW3QNQDF" crossorigin="anonymous"></script>
```

### 2.2 Formatting With Bootstrap

Let's edit our `boilerplate.ejs` to format our page

```js
<main class="container">
    <%- body %> 
</main>
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img4.jpg?raw=true)