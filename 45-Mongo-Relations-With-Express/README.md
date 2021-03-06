# Section 45: Mongo Relationships With Express

## 1. Defining Our Farm and Product Models

We will reuse our Farmstand app from Section 37, where we talked about Mongoose with Express. Note that our new connection will be `mongodb://localhost:27017/farmStandTake2`. There should be nothing in our DB right now

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img1.jpg?raw=true)

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

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img2.jpg?raw=true)

### 2.2 Farm POST Request

Now we will make a POST request for submitting a farm. This will be an async function because we are making a new model and saving it asynchronously. We are using the current `res.send()` to test out if we have successfully sent our data

```js
app.post('/farms', async(req, res) => {
    res.send(req.body)
});
```

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img3.jpg?raw=true)

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img4.jpg?raw=true)


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

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img6.jpg?raw=true)


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

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img7.jpg?raw=true)


## 4. Creating Products For A Farm

### 4.1 Intro

We will focus on creating a product for a specific farm. This has a lot to do with our farm relationships. What we have right now with creating a new product is just for creating a standalone product. We are not associating it with a farm as of now

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img8.jpg?raw=true)

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

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img9.jpg?raw=true)

And if you notice, the path we're on is correct. We do have the ID for the particular farm that we are adding to. Let's modify our form's action so that we can submit our product to the farm associated with it

```js
<form action="/farms/<%=id%>/products" method="post">
```

You can see in the inspecter that we have the farm ID in our route

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img10.jpg?raw=true)

#### 4.2.2 POST Request

Now we will make our POST request that will handle the information that we send. 

```js
app.post('/farms/:id/products', (req, res) => {
    res.send(req.body);
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img11.jpg?raw=true)

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img12.jpg?raw=true)

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

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img13.jpg?raw=true)

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img14.jpg?raw=true)

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

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img15.jpg?raw=true)

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

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img15.jpg?raw=true)

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

## 5. Finishing Touches

### 5.1 UX Fixes

The first thing that we want to fix is that we're sending a response of HTML directly back from a POST request, and we don't want to do that, so instead of `res.send()`, let's redirect to the individual farm page

```js
app.post('/farms/:id/products', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    const {name, price, category} = req.body;
    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`);
});
```

So now when we add a new product, we should also add a link so we can get to this page, so let's do that on our show page

```html
<h1><%= farm.name %></h1>
<ul>
    <li>City: <%= farm.city %> </li>
    <li>Email: <%= farm.email %> </li>
</ul>
<a href="/farms/<%=farm._id%>/products/new">Add Farm</a>
<a href="/farms">All Farms</a>
```

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img16.jpg?raw=true)

### 5.2 Displaying Farm's Products

Now let's try adding an item to this farm. Note that when we do add this, we don't see it show up on our farm page, but we can see it on the All Products page

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img17.jpg?raw=true)


![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img18.jpg?raw=true)

So now let's list all of the products for each farm's page. First we need to see what data we have in our `farm` variable from this route

```js
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    console.log(farm)
    res.render('farms/show', {farm})
});
```

```
{
  products: [ 5fda7ddfa90f525cd8b88024, 5fdbac873107654844100595 ],
  _id: 5fda6c49a9eab448dcf6dec2,
  name: 'Full Belly Farms',
  city: 'Guinda',
  email: 'fbfarms@gmail.com',
  __v: 2
}
```

We have an array of ID's, so we will make sure that we populate the products in our farm

```js
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id)
        .populate('products');
    console.log(farm);
    res.render('farms/show', {farm})
});
```

```
{
  products: [
    {
      _id: 5fda7ddfa90f525cd8b88024,
      name: 'Melon',
      price: 5,
      category: 'fruit',
      farm: 5fda6c49a9eab448dcf6dec2,
      __v: 0
    },
    {
      _id: 5fdbac873107654844100595,
      name: 'Quail Eggs',
      price: 4,
      category: 'dairy',
      farm: 5fda6c49a9eab448dcf6dec2,
      __v: 0
    }
  ],
  _id: 5fda6c49a9eab448dcf6dec2,
  name: 'Full Belly Farms',
  city: 'Guinda',
  email: 'fbfarms@gmail.com',
  __v: 2
}
```

So now it's up to use what we actually want to display for each product. Let's set this up in our farm show page

```html
<h2>Products</h2>
<ul>
    <% for( let product of farm.products ) { %>
        <li><%= product.name %> </li>
    <% } %> 
</ul>
```

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img19.jpg?raw=true)

### 5.3 Displaying Farm Name When Adding Product

When we add a product, the header just says "Add A Product". We don't know what farm we are adding it to. Let's add some changes to our GET route by finding the farm by ID

```js
app.get('/farms/:id/products/new', async (req, res) => {
    const {id} = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', {categories, farm});
});
```

And then let's add the name of the farm in our header tag. We are also changing the form action from `id` to `farm._id` since we are passing in the farm object

```html
<h1><%= farm.name %> </h1>
<h2>Add A Product</h2>
<form action="/farms/<%=farm._id%>/products" method="post">
...
</form>
```

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img20.jpg?raw=true)


### 5.4 Link to Individual Products

Let's put this in our farm show page so that we can go to each product's link

```html
<ul>
    <% for( let product of farm.products ) { %>
        <li><a href="/products/<%= product._id %>"> <%= product.name %></a></li>
    <% } %> 
</ul>
```

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img21.jpg?raw=true)

### 5.5 Show Farm in Product Page

Let's show the farm in the product page and make it a link to the farm. What we want to do is populate the farm field on our product

```js
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    // adding .populate()
    const product = await Product.findById(id)
        .populate('farm', 'name');
    console.log(product);
    res.render('products/show', {product});
});
```

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img22.jpg?raw=true)

And now let's put the link in our product show page

```html
<ul>
...
    <li><a href="/farms/<%= product.farm._id %>"><%= product.farm.name %></a> </li>
</ul>
```

## 6. Deletion Mongoose Middleware

When we have related models, what happens when you delete something, like a farm? What happens to the products? Let's take a look at some real apps. For reddit, when a user deletes their account, their posts are still intact; just that their username shows as 'deleted'. On Twitter, when a user deletes their account, all of their tweets get deleted. It's really how we want to structure our app

In our example, when we delete a farm, we will also delete the products. Let's set up a DELETE route

```js
app.delete('/farms/:id', async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
});
```

Now let's set up our delete button in our farm show page

```html
 <form action="/farms/<%=farm._id%>?_method=DELETE" method="post">
    <button>Delete</button>
</form>
```

Before we delete anything, let's make sure the DELETE request actually works

```JS
app.delete('/farms/:id', async (req, res) => {
    console.log('DELETING!!!!!!!')
    // const farm = await Farm.findByIdAndDelete(req.params.id);
    res.redirect('/farms');
});
```

So when we click on the delete button on the farm page, we will see the 'DELETING' on the console

So there's a couple of ways we can approach this. One is where we take the farm information and delete all of the products in the farm. That works, but there's another way to do this, which is useful when we have larger apps. We could write a bunch of code, but let's use Mongoose Middleware instead. First we would do this in our `farm.js` file 

```js
farmSchema.pre('findOneAndDelete', async function(data) {
    console.log('PRE MIDDLEWARE');
    console.log(data);
});

farmSchema.post('findOneAndDelete', async function(data) {
    console.log('POST MIDDLEWARE');
    console.log(data);
});
```

Let's test this out by deleting a farm

```
PRE MIDDLEWARE
[Function]
POST MIDDLEWARE
{
  products: [],
  _id: 5fdbbfe91e7c9829645bc653,
  name: 'Delete Me Farms',
  city: 'Deleteville',
  email: 'delete@delete.com',
  __v: 0
}
```

The data that we passed in was not real data. It was a function. Inside of the pre-middleware, we don't have access to the farm, but in the post, we do. Let's remove the pre-middleware and modify our post

```js
farmSchema.post('findOneAndDelete', async function(farm) {
    if(farm.products.length) {
        const result = await Product.deleteMany({_id: {$in: farm.products}});
        console.log(result);
    }
})
```

![img23](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img23.jpg?raw=true)

![img24](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/45-Mongo-Relations-With-Express/img-for-notes/img24.jpg?raw=true)

```
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
{ n: 3, ok: 1, deletedCount: 3 }
```