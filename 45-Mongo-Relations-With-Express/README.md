# Section 45: Mongo Relationships With Express

## 1. Defining Our Farm and Product Models

We will reuse our Farmstand app from Section 37, where we talked about Mongoose with Express. Note that our new connection will be `mongodb://localhost:27017/farmStandTake2`. There should be nothing in our DB right now

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img1.jpg?raw=true)

What we want to do for this app is to integrate farms, so each product is associated with a farm. So now we will have some models and routes for farms. Let's first start with our farm model in our new `farm.js` file

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    products: [

    ]
});
```

A farm can have many products, so how can we make the one-to-many relationship between a farm and its products? First of all, we don't want to embed products in our farm. And the erason for this is that we'd like to still have a page so that we can view all products from all farms, and that'd might be the most useful page. We can have a dashboard to see what is selling high or low.

There are many ways we can do this. We could have a `products` field in our `farmSchema` and reference the product ID's in an array, or we can have a `farm` field in our `productSchema` to reference the farm ID. It really depends on how we're using this

We'll do a two-way relationship, because sometimes when we show a single product, we would also like to show what farm it came from

```js
// product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
});
```

```js
// farm.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});
```

Now this isn't to say that this is the best relationship to have. There are better ways, but this works for our current use case

## 2. Creating New Farms

So we'd like to create a newform that we render where a user can create a new farm. We'll make a GET request for displaying farms and for creating one. This is where we will have a form that we can submit. As you notice, our `index.js` is very crowded, and soon we'll learn a way of fixing this or moving all of these routes into different places with Express Router

### 2.1 Farm Form

Note that when we are just rendering a form, it doesn't need to be an async function

```js
app.get('/farms/new', (req, res) => {
    res.render('farms/new')
});
```

Now we will make the form for our farm. This is what it would look like in our `new.ejs`

```html
<h1>Add A Farm</h1>
<form action="/farms" method="post">
    <div>
        <label for="name">Farm Name</label>
        <input type="text" name="name" placeholder="Farm Name" id="name">
    </div>
    <div>
        <label for="city">City</label>
        <input type="text" name="city" placeholder="Farm City" id="city">
    </div>
    <div>
        <label for="email">Email</label>
        <input type="email" name="email" placeholder="Email" id="email">
    </div>
    
    <button>Submit</button>
</form>
<a href="/farms">Cancel</a>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img2.jpg?raw=true)

### 2.2 Farm POST Request

Now we will make a POST request for submitting a farm. This will be an async function because we are making a new model and saving it asynchronously. We are using the current `res.send()` to test out if we have successfully sent our data

```js
app.post('/farms', async(req, res) => {
    res.send(req.body)
});
```

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img3.jpg?raw=true)

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img4.jpg?raw=true)


So now we need to instantiate and save a new farm. Let's require our farm model in our file and modify our POST route

```js
app.post('/farms', async(req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    res.redirect('/farms');
});
```

### 2.3 Farm Page

Now we will make our farm route and page

```js
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', {farms})
});
```

```html
<!-- index.ejs -->
<body>
    <h1>All Farms</h1>
    <ul>
        <% for(let farm of farms) { %> 
            <li><%= farm.name %></li>
        <% } %>
    </ul>
</body>
```

Now let's try creating our new farm

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img6.jpg?raw=true)


## 3. Farms Show Page

### 3.1 Route

In this section, we will just quickly set up our show page for a specific farm. Let's set up a GET request, and we would want an async handler because we are finding that farm in our DB

```js
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    res.render('farms/show', {farm})
});
```

### 3.2 Slighly Modifing farms/index.ejs

Right now in our `index.ejs`, we are only showing farm names, but they don't have a link tag associated with them. Let's add the tags in our `index.ejs` so that when we click on them, it takes us to the farm show page

```html
<ul>
    <% for(let farm of farms) { %> 
        <li><a href="/farms/<%=farm._id%> "><%= farm.name %></a></li>
    <% } %>
</ul>
```

### 3.3 Creating Our Show Page

Now let's create our show page

```html
<body>
    <h1><%= farm.name %></h1>
    <ul>
        <li>City: <%= farm.city %> </li>
        <li>Email: <%= farm.email %> </li>
    </ul>
    <a href="/farms">All Farms</a>
</body>
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img7.jpg?raw=true)
