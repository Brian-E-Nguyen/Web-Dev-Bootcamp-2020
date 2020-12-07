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

## 3. Navbar Partial

We will have this code as our navbar and will paste this in our `boilerplate.ejs` for now to test it out

```html
<nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
<div class="container-fluid">
    <a class="navbar-brand" href="#">YelpCamp</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
        <a class="nav-link" href="/">Home</a>
        <a class="nav-link" href="/campgrounds">Campgrounds</a>
        <a class="nav-link" href="/campgrounds/new">New Campgrounds</a>
    </div>
    </div>
</div>
</nav>
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img5.jpg?raw=true)

We will make a new directory called _partials_ in our _views_ directory  and we'll call our new file `navbar.ejs`. In our `boilerplate.ejs`, we will have a new line of code. This means that our navbar is included in our boilerplate

```html
 <%- include('../partials/navbar') %> 
<main class="container mt-5">
    <%- body %> 
</main>
```

## 4. Footer Partial

We will make a `footer.ejs` in our *partials* folder

```html
<footer class="footer bg-dark">
    <div class="container">
        <span>YelpCamp 2020</span>
    </div>
</footer>
```

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img6.jpg?raw=true)

To make our footer go down, we will add a class to the `<body>` of our boilerplate

```html
<body class="d-flex flex-column vh-100">
```

and in our footer, we will add this

```html
<footer class="footer bg-dark py-3 mt-auto">
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img7.jpg?raw=true)

## 5. Adding Images

### 5.1 Unsplash API Overview

The way we are gonna add images to our campgrounds is to re-seed our DB with image URL's. We will be using the *Unsplash Source* API, which is an easy way to get free high-quality images

https://unsplash.com/collections/483251/in-the-woods

All we need to do is copy the collection ID and send a request to the URL

https://source.unsplash.com/collection/483251/1600x900

You will get a different image everytime you go to this link

### 5.2 Updaing Our Model and Displaying Our Image

We will update our `Campgrounds` model in `campgrounds.js` to include the image link

```js
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});
```

Then in our `index.js` file from our _seeds_ directory, we will have it display the image of the camp. We will also have add our description and price

```js
const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251/1600x900',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?",
            price: price
        });
        await camp.save();
    }
}
```

```
> db.campgrounds.find()
{ "_id" : ObjectId("5fcd3d32cb603f3944351f70"), "location" : "Oro Valley, Arizona", "title" : "Roaring Spring", "image" : "https://source.unsplash.com/collection/483251/1600x900", "description" : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?", "price" : 12, "__v" : 0 }

...
```

Now let's go into our `show.ejs` to display the image, description, and price

```html
<h1><%= campground.title %> </h1>
<h2><%= campground.location %> </h2>
<img src="<%= campground.image %> " alt="">
<p><%= campground.description %> </p>
<p><strong>Price:</strong> $<%= campground.price %> </p>
```

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img9.jpg?raw=true)

A problem that we have is everytime we refresh the page, a new image appears. We can fix that later

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img10.jpg?raw=true)

## 6. Styling Campground Index

We will not make an `<li>` in our `index.ejs`. Instead we will make a Bootstrap card

```html
<% for( let campground of campgrounds ) { %>
    <div class="card" mb-3>
        <div class="row">
            <div class="col-md-4">
                <img class="img-fluid" alt="" src="<%= campground.image %> ">
            </div>
        </div>
    </div>
<% } %>
```

So far it's not looking great because they all have the same image

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img11.jpg?raw=true)

Let's add a card title and description to it

```html
<% for( let campground of campgrounds ) { %>
    <div class="card" mb-3>
        <div class="row">
            <div class="col-md-4">
                <img class="img-fluid" alt="" src="<%= campground.image %> ">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"><%= campground.title %></h5>
                    <p class="card-text"><%= campground.description %></p>
                    <p class="card-text">
                        <small class="text-muted"><%= campground.location %> </small>
                    </p>
                    <a class="btn btn-primary" href="/campgrounds/<%=campground._id%>">View <%= campground.title %> </a>
                </div>
            </div>
        </div>
    </div>
<% } %>
```

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img12.jpg?raw=true)


## 6. Styling the "New Campground" Form

### 6.1 Centering

We will be styling the "new campground" form, which is located inside of `new.ejs`. We will add some new `<div>` tags with Boostrap classes and nest our form in them. This will help center our form

```html
<div class="row">
    <h1 class="text-center">New Campground</h1>
    <div class="col-6 offset-3">
        <form action="/campgrounds" method="post">
            <div>
                <label for="title">Title</label>
                <input type="text" name="campground[title]" id="title">
            </div>
            <div>
                <label for="location">Location</label>
                <input type="text" name="campground[location]" id="location">
            </div>
            <button>Add Campground</button>
        </form>
    </div>
</div>
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img13.jpg?raw=true)

### 6.2 Bootstrap Form Classes

Forms in Bootstrap 5 have their own section, so let's see what they put

```html
<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>

...

 <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

As you can see, there are class values with `form-label`, `form-text`, etc. Let's try using them

```html
<div>
    <label class="form-label" for="title">Title</label>
    <input class="form-control" type="text" name="campground[title]" id="title">
</div>
```

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img14.jpg?raw=true)

The input field automatically scales to the size of the window. Let's do the same for the location. In additon, bootstrap recommends adding a margin bottom to each of the fields. Lastly, we will make out button look nicer

```html
<% layout('layouts/boilerplate') %> 
<div class="row">
    <h1 class="text-center">New Campground</h1>
    <div class="col-6 offset-3">
        <form action="/campgrounds" method="post">
            <div class="mb-3">
                <label class="form-label" for="title">Title</label>
                <input class="form-control" type="text" name="campground[title]" id="title">
            </div>
            <div class="mb-3">
                <label class="form-label" for="location">Location</label>
                <input class="form-control" type="text" name="campground[location]" id="location">
            </div>
            <div class="mb-3">
                <button class="btn btn-success">Add Campground</button>
            </div>
        </form>
        <a href="/campgrounds">All Campgrounds</a>
    </div>
</div>
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img15.jpg?raw=true)

**PRO TIP:** in VS Code, to select every instance of a word when editing a file, use CTRL+D

### 6.3 Adding More Input Fields

Now we will add a field for image URL and description. Note that the description will use `<textarea>` instead

```html
...
<div class="mb-3">
    <label class="form-label" for="image">Image URL</label>
    <input class="form-control" type="text" name="campground[image]" id="location">
</div>
<div class="mb-3">
    <label class="form-label" for="description">Description</label>
    <textarea class="form-control" type="text" name="campground[description]" id="description"></textarea>
</div>
```

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img16.jpg?raw=true)

Now we also need a price field.

```html
 <div class="mb-3">
    <label class="form-label" for="price">Campground Price</label>
    <div class="input-group">
        <span class="input-group-text" id="price-label">$</span>
        <input type="text" id="price" class="form-control" placeholder="0.00" aria-label="0" aria-describedby="price-label" name="campground[price]">
    </div>
</div>
```

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img17.jpg?raw=true)

### 6.4 Testing Out Our Form

And lastly, let's test out our form to see if it works

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img18.jpg?raw=true)

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img19.jpg?raw=true)

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img20.jpg?raw=true)


## 7. Styling Edit Form

For this part, we are just copying what we had from the `new.ejs` form and changing some of the attributes. Mostly it's just adding the `value` tag so that the form is prefilled with data

```html
<% layout('layouts/boilerplate') %> 
<div class="row">
    <h1 class="text-center">Edit Campground</h1>
    <div class="col-6 offset-3">
        <form action="/campgrounds/<%=campground._id%>?_method=PUT" method="post">
            <div class="mb-3">
                <label class="form-label" for="title">Title</label>
                <input class="form-control" type="text" name="campground[title]" id="title" value="<%=campground.title%>">
            </div>
            <div class="mb-3">
                <label class="form-label" for="location">Location</label>
                <input class="form-control" type="text" name="campground[location]" id="location" value="<%=campground.location%>">
            </div>
            <div class="mb-3">
                <label class="form-label" for="image">Image URL</label>
                <input class="form-control" type="text" name="campground[image]" id="image" value="<%=campground.image%>">
            </div>
            <div class="mb-3">
                <label class="form-label" for="price">Campground Price</label>
                <div class="input-group">
                    <span class="input-group-text" id="price-label">$</span>
                    <input type="text" id="price" class="form-control" placeholder="0.00" aria-label="0" aria-describedby="price-label" name="campground[price]" value="<%=campground.price%>">
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label" for="description">Description</label>
                <textarea class="form-control" type="text" name="campground[description]" id="description"><%= campground.description %> </textarea>
            </div>
            <div class="mb-3">
                <button class="btn btn-info text-white">Update Campground</button>
            </div>
        </form>
        <a href="/campgrounds/<%= campground._id %> ">Back to Campground</a>
    </div>
</div>
```

Note that in the pics below, the top form is what we had before. We are just keeping it there temporarily to see if the new form works (which it does)

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img21.jpg?raw=true)

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/41-YelpCamp-Styles/41-YelpCamp-Styles/img-for-notes/img22.jpg?raw=true)

