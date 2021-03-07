# Section 57 - YelpCamp: Styles Clean Up

We want to get to deploying ASAP. There are definitely errors, bugs, and issues, big and small, that we don't know at this point. There are still features that we want to add. If you look at what we have now, we already have the full CRUD. We've covered a lot, but it's still rough around the edges. The number one thing that we want to fix right now is our home page. It sucks

## 1. Styling Home Page

### 1.1 Importing Bootstrap Stuff

This is what we have currently inside of our `home.ejs` file

```html
<!-- home.ejs -->
<% layout('layouts/boilerplate') %> 
<h1>HOME! YELP CAMP!</h1>
```

We don't need the layout for this page because it includes Mapbox code and other stuff that we don't need for the landing page. We'll instead have a modified navbar, a fullscreen pic, and more. Let's start off with a basic HTML5 template; then, we will include the Boostrap CSS at the `<head>` tag and its CDN at the bottom of the `<body>` tag

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" 
        href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"
        integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" 
        crossorigin="anonymous">
    <title>YelpCamp</title>
</head>
<body>



   <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js"
        integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/"
        crossorigin="anonymous"></script>
</body>
</html>
```

### 1.2 Styling

Let's make changes to the body tag and add some stuff inside of it

```html
<body class="d-flex h-100 text-center text-white bg-dark">
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="mb-auto">
            <div>
                <h3 class="float-md-left mb-0">YelpCamp</h3>
                <nav class="nav nav-masthead justify-content-center float-md-right">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                    <a class="nav-link" href="/campgrounds">Campgrounds</a>
                </nav>
            </div>
        </header>
    </div>

...

</body>
```

Then we will add in some more link tags to make our navbar

```html
<nav class="nav nav-masthead justify-content-center float-md-right">
    <a class="nav-link active" aria-current="page" href="#">Home</a>
    <a class="nav-link" href="/campgrounds">Campgrounds</a>
    <% if(!currentUser) { %> 
    <a class="nav-link" href="/login">Login</a>
    <a class="nav-link" href="/register">Register</a>
    <% } else { %> 
    <a class="nav-link" href="/logout">Logout</a>
    <% } %> 
</nav>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img1.jpg?raw=true)

Let's make a new stylesheet called `home.css` where we will put our CSS code for our home page. Inside of it, let's define our `conver-container` class with this code. Then we will reference that sheet inside of our `home.ejs` file.

```css
/* home.css */
.cover-container {
    max-width: 60vw;
}
```

Now our home page should look like this:

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img2.jpg?raw=true)

Right below the end of the `<header>` tag, let's add more to that body with some descriptions, buttons, and a copyright section

```html
<main class="px-3">
    <h1>YelpCamp</h1>
    <p class="lead">
        Welcome to YelpCamp!
        <br>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Provident consequuntur similique distinctio ipsam iste laborum omnis fugit eligendi labore cupiditate magnam amet dolores rem nemo animi autem, 
        accusamus consequatur vero.
    </p>
    <a href="/campgrounds" 
        class="btn btn-lg 
                btn-secondary 
                font-weight-bold 
                text-white 
                bg-white">View Campgrounds</a>
</main>

<footer class="mt-auto text-white-50">
    <p>&copy; 2021</p>
</footer>
```

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img3.jpg?raw=true)


Lastly, let's change the `body` class to have a height of 100vh (view height)

```css
/* home.css */
body {
    height: 100vh;
}
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img4.jpg?raw=true)

## 2. Additional Home Page Styling

### 2.1 Background Image

Our home page is lookng bland right now. The first noticable thing that we can do is adding a background image to the body. Let's add this inside of body styling

```css
body {
    height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
    /* prevents repeat image */
    background-size: cover;
    background-position: center;
}
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img5.jpg?raw=true)

### 2.2 Nav links

Let's edit our nav links so that they look fancier

```css
.nav-link {
    padding: 0.25rem 0;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 1rem;
}
```

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img6.jpg?raw=true)

The next thing we'll do for the links is give them a border on the bottom, but make them transparent. When we hover over them, then they will display

```css
.nav-link {
    padding: 0.25rem 0;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 1rem;
    border-bottom: 0.25rem solid transparent;
}

.nav-link:hover {
    color: rgba(255, 255, 255, 0.5);
    border-bottom-color: rgba(255, 255, 255, 0.5);
}
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img7.jpg?raw=true)

One last thing is to make the link active on its current page

```css
.nav-link.active {
    color: white;
}
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img8.jpg?raw=true)


### 2.3 Body Editing

On the body, we'll give it a box shadow and a text shadow and then we'll change our button so that it doesn't inherit the text shadow

```css
body {
    height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
    /* prevents repeat image */
    background-size: cover;
    background-position: center;
    text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.5);
    box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.5);
}

.btn-secondary, .btn-secondary:hover {
    color: #333;
    text-shadow: none;
}
```

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img9.jpg?raw=true)

## 3. Styling Login Form

Next up, we will make the login form a bit nicer by using pure Bootstrap. We will make it skinnier and will add an image on top. Let's first cut out and add some new code

```html
<!-- login.ejs -->
<div class="container">
    <div class="row">
        <div class="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
            <div class="card shadow">
                <div class="card-body">
                    <h5 class="card-title">Login</h5>
                
                </div>
            </div>
        </div>
    </div>
</div>
```

We'll paste everything that we've cut out into the empty `<div>` and this is what it looks like

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img10.jpg?raw=true)

Next we'll add the image to it. We'll put it above the `<div class="card-body">`

```html
<!-- login.ejs -->
<div class="container">
    <div class="row">
        <div class="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
            <div class="card shadow">
                <img src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                    alt="" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">Login</h5>
                
                </div>
            </div>
        </div>
    </div>
</div>
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img11.jpg?raw=true)

Some extra things that we can do is that we can add the `autofocus` value on the username input so that the cursor is already in there when we load the page

```html
<input class="form-control" type="text" name="username" id="username" autofocus required>
```

And for our login button, we can have it span across the card

```html
<div class="d-grid gap-2">
    <button class="btn btn-success">Login</button>
</div>
```

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/57-YelpCamp-Styles-Cleanup/57-YelpCamp-Styles-Cleanup/img-for-notes/img12.jpg?raw=true)