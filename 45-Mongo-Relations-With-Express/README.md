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


## 4. Creating Products For A Farm

### 4.1 Intro

We will focus on creating a product for a specific farm. This has a lot to do with our farm relationships. What we have right now with creating a new product is just for creating a standalone product. We are not associating it with a farm as of now

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img8.jpg?raw=true)

There are some ways we can do this. We could have a dropdown menu of all the farms and you can select from there, but what if there are hundreds or thousands of farms? That wouldn't be a good idea. What we could do on the farm show page is have a link that says "Add New Product" and we will be able to add our products to have an association with that farm. 

### 4.2 Defining Our Routes

The most important part for this section is that our routes will include the farm ID inside of it. Here is how we will lay out our requests

```
GET
/farms/:farm_id/products/new

POST
/farms/:farm_id/products
```

#### 4.2.1 GET Request

The first request will be to render the form for this one farm, then we will send a POST request to the next path. The reason for this is because we want the farm ID, and we want to know what farm the product is associated with. There are other ways to do this, but this is a common way to do this. Below is our GET route

```js
app.get('/farms/:id/products/new', (req, res) => {
    res.render('products/new');
});
```

There's a problem with this. Let's take a look at the form in `new.ejs`. Look at what the `<form>` tag says

```html
<form action="/products" method="post">
```

We are submitting this to `/products`, but now we want to submit to `/farms/products` with our new routes. Let's first set up our GET request

```js
app.get('/farms/:id/products/new', (req, res) => {
    const {id} = req.params;
    res.render('products/new', {categories, id});
});
```

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img9.jpg?raw=true)

And if you notice, the path we're on is correct. We do have the ID for the particular farm that we are adding to. Let's modify our form's action so that we can submit our product to the farm associated with it

```js
<form action="/farms/<%=id%>/products" method="post">
```

You can see in the inspecter that we have the farm ID in our route

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img10.jpg?raw=true)

#### 4.2.2 POST Request

Now we will make our POST request that will handle the information that we send. 

```js
app.post('/farms/:id/products', (req, res) => {
    res.send(req.body);
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img11.jpg?raw=true)

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img12.jpg?raw=true)

### 4.3 Saving Our Product

Now let's actually save our product. We have the field on our `productSchema`, which references a farm. We will look up the farm itself and use it for saving. For now, let's use this code to test it out

```js
app.post('/farms/:id/products', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    const {name, price, category} = req.body;
    const product = new Product(req.body);
    res.send(farm);
});
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img13.jpg?raw=true)

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img14.jpg?raw=true)

Now we actually connect the product with the farm. Remember that we have a two-way association with the product and the farm,, so we can do this

```js
app.post('/farms/:id/products', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    const {name, price, category} = req.body;
    const product = new Product(req.body);
    // two-way association
    farm.products.push(product);
    product.farm = farm;
    res.send(farm);
});
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img15.jpg?raw=true)

Now let's actually save our product and farm

```js
app.post('/farms/:id/products', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    const {name, price, category} = req.body;
    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    // saving our data
    await farm.save();
    await product.save();
    res.send(farm);
});
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/45-Mongo-Relations-With-Express/45-Mongo-Relations-With-Express/img-for-notes/img15.jpg?raw=true)

This is what it looks like in Mongoose, where the entire product is stored, but what does it look like in Mongo?

```
> db.farms.find()

{ "_id" : ObjectId("5fda6c49a9eab448dcf6dec2"), "products" : [ ObjectId("5fda7ddfa90f525cd8b88024") ], "name" : "Full Belly Farms", "city" : "Guinda", "email" : "fbfarms@gmail.com", "__v" : 1 }
```

It only stores the product ID. Let's do a `db.products.find()`

```
> db.products.find() 

{ "_id" : ObjectId("5fda7ddfa90f525cd8b88024"), "name" : "Melon", "price" : 5, "category" : "fruit", "farm" : ObjectId("5fda6c49a9eab448dcf6dec2"), "__v" : 0 } 
```