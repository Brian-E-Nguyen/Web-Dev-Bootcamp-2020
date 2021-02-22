# Section 54 - YelpCamp: Image Upload

## 1. Intro to Image Upload Process

We will now tackle on uploading an image to our website. It's not from anything that we've learned from this course, but it's a nice-to-have. Instead of typing an image URL, which is garbage, we could upload a single or multiple files. This is a multi-step process and there are two things you need to know upfront:

1. a regular HTML form is not able to send files to our server, so we will have to change our form to do that
2. we need to store the images somewhere, and we don't store them in Mongo because image file sizes are very large. Instead, we will use a tool called _Cloudinary_ that stores photos and lets us easily retrieve them

We will set up our form so that it accepts files, and it will hit our server and then our endpoint somewhere. Then we will take the files and store in _Cloudinary_; the tool will then send us the URL to our images, then we can store the URL's in our Mongo DB

## 2. The Multer Middleware

### 2.1 File Input

If we want to upload files with our form, we would need to set the encoding type to be `multipart/form-data`. This will break some things for us, but we'll worry about those problems later. In our `new.ejs`, we will set the `enctype` to that value

```html
<!-- new.ejs -->
<form action="/campgrounds" method="post" novalidate class="validated-form" enctype="multipart/form-data">
```

Then we can add an input for a file. We will replace it with the current input for image URL, which will look like this

```html
<!-- new.ejs -->
<input type="file" name="image" id="">
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img1.jpg?raw=true)

### 2.2 Editing Our Route

The next thing we'll do is go over to the route where the campground is submitted. Let's display the `req.body` in our console so that we know what we're sending

```js
// routes/campgrounds.js
router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post((req, res) => {
        res.send(req.body)
    });
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img3.jpg?raw=true)

### 2.3 Using Multer

When we submit that form, we will hit that route, but there's nothing in the body. This brings us to the next point, which is in order to parse multipart forms, we need to use another middleware called _Multer_. Multer does what the built-in body-parsing middleware does, so that we can parse JSON or URL-encoded data

**Link to the docs**

- https://github.com/expressjs/multer

#### 2.3.1 Single File Upload

Let's import Multer to our `routes/campgrounds.js` file. On our POST route for `/`, we can add in the `upload` tag

```js
// routes/campgrounds.js
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post(upload.single('image'),(req, res) => {
        console.log(req.body, req.file);
        res.send('IT WORKED!!!!!!!!');
    });
```

Let's try this out by uploading our image

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img4.jpg?raw=true)

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img5.jpg?raw=true)

This tells us information about our file and where it is, and you can see we have an _uploads_ folder created in our app. For now, we don't care about where we are storing those files since we will send them to the cloud later.

### 2.3.2 Mutiple File Upload

From the previous example, we've used `upload.single()`, but we can also use `upload.array()`, which would expect multiple files. 

```js
// routes/campgrounds.js
router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post(upload.array('image'),(req, res) => {
        console.log(req.body, req.files);
        res.send('IT WORKED!!!!!!!!');
    });
```

To do this in our input tag on `new.ejs`, we would have another value called `multiple`

```html
<input type="file" name="image" id="" multiple>
```

Now that we set it to multiple files, we would need to change `req.file` to `req.files` in our POST route

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img6.jpg?raw=true)

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img7.jpg?raw=true)


## 3. Cloudinary Registration

**Link to Cloudinary**

- https://cloudinary.com/

Create and log into your account. We will use the API key and the secret for our app, but we don't want to directly embed those in our code and put them on GitHub; the reason for this is that if anyone sees our code, then they have access to our credentials. And if we connect our credit card to this app, someone can just store a bunch of stuff in your own account, and that can be very expensive. This applies to every service with API calls

## 4. Environment Variables with dotenv

What we do instead of directly embedding API creds or secret keys is storing them in a file that we don't include when we submit online. We use a `.env` file to store our information. Let's make a .env file and store it in the top level of our application.

The basics of a .env file is that it's like a key-value file. The naming of the keys can be anything. Below is an example

```
SECRET=aabc123
```

Next, we will install a package called _dotenv_

```
npm i dotenv
```

Inside of our `app.js`, we will add this code at the very top

```js
// app.js
if(process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}
```

We're saying if we're running in development mode (which we are), then require the _dotenv_ package, which will take the variables defined in our .env file and add them to `process.env.NODE_ENV`

So now, we have access to the different variables in .env. Let's run our app to see the secret printed out

```js
console.log(process.env.SECRET)
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img8.jpg?raw=true)

Let's add in the things that we want to store in the .env file (remember you can name the keys however you want)

```
CLOUDINARY_CLOUD_NAME=AAAAAAAAAAAA
CLOUDINARY_KEY=AAAAAAA
CLOUDINARY_SECRET=AAAAAAAAAAAAA
```

## 5. Uploading To Cloudinary Basics

The next step is to take the files that Multer is able to pass in and upload them to Cloudinary. To do this, there's an easy tool called _Multer Storage Cloudinary_ to make it a smooth process

**Link to the docs**

- https://github.com/affanshahid/multer-storage-cloudinary

### 5.1 Setting Up Our Config

To use this, we need to first install the following packages

`npm i cloudinary multer-storage-cloudinary`

Then we will copy the imports and place them in a new file called `index.js` inside of new folder called _cloudinary_. The next thing we'll do is setting the config

```js
// cloudinary/index.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
```

We are setting these keys to the values stored in our .env file. The next thing we'll do is configure the storage of our files

```js
// cloudinary/index.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    ...
});

const storage = new CloudinaryStorage({
    cloudinary, 
    // the folder that we'll store our files in Cloudinary
    folder: 'YelpCamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
});
```

Lastly, we'll export both of those variables. The entire file should look like this:

```js
// cloudinary/index.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary, 
    // the folder that we'll store our files in Cloudinary
    folder: 'YelpCamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
});

module.exports = {
    cloudinary,
    storage
}
```

### 5.2 Changing campgrounds.js

Inside of our `campgrounds.js` file in our _routes_ folder, we will require the `storage` object. Note that for our path, we don't have to put '../cloudinary/index.js' because Node will automatically detect `index.js` files. For our upload destination, will replace the current one with `storage`

```js
// routes/campgrounds.js
const {storage} = require('../cloudinary');
const upload = multer({ storage });
```

### 5.3 Uploading Our Photos

Now let's try sending a file and see if it works

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img9.jpg?raw=true)

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img10.jpg?raw=true)

The pics are now stored on Cloudinary

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img11.jpg?raw=true)

We get these really weird names so that we don't have conflicts when more than 1 person uploads an image of the same name

## 6. Storing Uploaded Links in Mongo

### 6.0 Fixing Upload Mistake From Previous Section

One thing that Colt did incorrectly in the previous video was the folder and the allowed formats. The uploads didn't actually go into the _YelpCamp_ folder on Cloudinary. We need to put this information inside of `params`

```js
// cloudinary/index.js
const storage = new CloudinaryStorage({
    cloudinary, 
    params: {
        // the folder that we'll store our files in Cloudinary
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

```

Everything should work now

### 6.1 Fixing Our Backend

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img12.jpg?raw=true)

What we want to do now is take the path and filename of the file and store them. First let's update our model in `campgrounds.js`. For the value of the `image` field, we will change it to an array

```js
const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
...
```

Then we will go to `routes/campgrounds.js` to add in the upload file middleware

```js
// routes/campgrounds.js
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, upload.array('image'), catchAsync(campgrounds.createCampground));
```

Then inside of our `controllers/campgrounds.js`, we will retrieve the filenames and add them to our campground

```js
// controllers/campgrounds.js
module.exports.createCampground = async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}
```

Let's see what happens here by displaying our `campground` object in our console

**NOTE:** There's an error when we do submit our campground, so we have to reorder our middleware for now. This is bad in a production environment because we don't want to upload our images before we validate a campground, but we'll have to do it this way for now

```js
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
```

And inside of our `schemas.js`, we'll remove the validation for images for now

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img13.jpg?raw=true)


![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img14.jpg?raw=true)

### 6.2 Displaying Our Image

Inside of our `show.ejs`, we will loop over all of our images

```html
<% for (let image of campground.images) { %> 
    <img src="<%= image.url %> " class="card-img-top" alt="...">
<% } %> 
```
![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img15.jpg?raw=true)


Let's try uploading two pics

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img16.jpg?raw=true)

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img17.jpg?raw=true)


## 7. Displaying Images In A Carousel

### 7.1 The Process

We'll add a carousel so that we can easily see all of the images for a campground without the clutter. We will copy the code provided in the Bootstrap carousel docs and put them in our `show.ejs`. We'll make some changes to it

**Link to Boostrap carousel docs**

- https://getbootstrap.com/docs/5.0/components/carousel/

We can start by looping over all of our images by using the code from the previous section

```html
<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
<div class="carousel-inner">
    <% for (let image of campground.images) { %> 
    <div class="carousel-item">
    <img src="<%= image.url %> " class="d-block w-100" alt="...">
    </div>
    <% } %> 
<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"  data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"  data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
</button>
</div>
```

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img18.jpg?raw=true)

One problem is that we set the `active` class on all images, and we don't want that. We only want 1 image to have the `active` class. We'll use a `foreach` loop instead so that we can access to each individual image

```html
<% campground.images.forEach((image, index) => { %> 
<div class="carousel-item <%= index === 0 ? 'active' : '' %> ">
    <img src="<%= image.url %> " class="d-block w-100" alt="...">
</div>
<% }); %> 
```

This will now work. If we go into the devtools, we can see that the `active` class will alternate between each image

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img19.jpg?raw=true)

### 7.2 One Image Carousel Fix

One problem is that there are some campgrounds that only have one image, yet the controls to switch between images still appear on them. This will be confusing to the user because they would think that the controls are broken. Let's fix that by adding a condition to check if there's more than 1 image on a campground

```html
 <% if (campground.images.length > 1) { %> 
<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"  data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"  data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
</button>
<% } %> 
```

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img20.jpg?raw=true)

## 8. Fixing Our Seeds

Right now, none of our campground thumbnails are showing when viewing all campgrounds because we changed the `image` field to `images` in our schema. We'll fix that in our seeds

```js
// seeds/index.js
 for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6014644ae18c19056071bdb6',
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: ...,
                  filename: ...
                },
                {
                  url: ...,
                  filename: ...
                },
                {
                  url: ...,
                  filename: ...
                }
              ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?",
            price: price
        });
```

Then inside of our `campgrounds/index.ejs` file, we will slightly edit our code so that we can show the first pic in the awrray

```html
<div class="col-md-4">
    <img class="img-fluid" alt="" src="<%= campground.images[0].url %> ">
</div>
```

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img21.jpg?raw=true)

## 9. Adding Upload to Edit Page

Let's give users the ability to add more photos when they're editing a particular campground. For time's sake, we'll show you how to do it with the existing form. It's not complex, but it's pretty bad UX

First, we'll make sure that our form supports multipart/form-data

```html
<form action="/campgrounds/<%=campground._id%>?_method=PUT" method="post" novalidate class="validated-form" enctype="multipart/form-data">
```

Then inside of our PUT request for campgrounds, we'll add the `upload.array('image')` middleware

```js
// routes/campgrounds.js
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
```

Then in our `edit.ejs`, we will add the input for multiple files

```html
<!-- edit.ejs -->
<div class="mb-3">
    <label class="form-label" for="image">Add Images</label>
    <input type="file" name="image" id="image" multiple>
</div>
```

Lastly, in our `controllers/campgrounds.js`, we will modify our `updateCampground` function to support image upload

```js
module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}
```

Let's try adding new photos to an existing campground to see if it works

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/54-YelpCamp-Image-Upload/54-YelpCamp-Image-Upload/img-for-notes/img22.jpg?raw=true)

