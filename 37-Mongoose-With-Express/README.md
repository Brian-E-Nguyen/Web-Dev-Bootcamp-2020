# 37. Mongoose With Express

## 1. Express + Mongoose Setup

We will make a Farmstand app, where we will sell many different types of fruits, vegetables, and any other products from farms

### 1.1 Initializing Our App

We will be making our new app inside of this current directory

1. `npm init -y`
2. `npm i express ejs mongoose`
3. `touch index.js`
4. `mkdir views`

Then we will set up our `index.js` with this code

### 1.2 Importing Express and EJS

```js
const express = require('express');
const app = express();
const path = require('path');
const portNumber = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

And now let's run `nodemon index.js` to see if it worked

```
$ nodemon index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node index.js`
APP IS LISTENING ON PORT 3000
```

And now let's make our first `app.get()` 

```js
app.get('/dog', (req, res) => {
    res.send('WOOF!');
});
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img1.jpg?raw=true)

We will move this logic to a separate file eventually. `index.js` will have no routes in it and the file will be pretty small

### 1.3 Importing Mongoose

Now let's import Mongoose

```js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONOG CONNECTION ERROR!!!!');
        console.log(error)
    });
```

### 1.4 Final Code (index.js)

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;

mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/dog', (req, res) => {
    res.send('WOOF!');
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```
## 2. Creating Our Models

### 2.1 Product Model File

We will make a separate directory for our models. The reason for this is that a typical application will have so many models that it will be a pain to write them all in one single file, especially because often they'll reference one another. Well make a `models` directory, and then a single file called `product.js`

```js
const mongoose = require('mongoose');

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
    }
});
```

We don't need to connect to the DB in this file because we will require `product.js` inside of `index.js`

Then we would need to compile our model and export it so that we can use it in other files

```js
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
```

Now inside of our `index.js` file, we will require our `Products` model

```js
const Product = require('./models/product');
```

### 2.2 Our Seed File

Now we will make another file to insert initial data in our application, otherwise it's a little bit annoying to build our app without any data in the database. We'll call this file `seed.js`

```js
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });
```

Now let's run our `seeds.js`. Make sure `mongod` is running in the background

```
$ node seeds.js
MONGO CONNECTION OPEN!!!
New data created: {
  _id: 5fb5791fcd7ca355a4ae067f,
  name: 'Ruby Grapefruit',
  price: 1.99,
  category: 'fruit',
  __v: 0
}
```

Now let's look at the data in our mongo shell

```
> db.products.find()
{ "_id" : ObjectId("5fb5791fcd7ca355a4ae067f"), "name" : "Ruby Grapefruit", "price" : 1.99, "category" : "fruit", "__v" : 0 }
```

Now let's make a couple more products quickly. So one option would be to just make them one at a time like this and save each one. A better way is to use the `Model.insertMany()` function

```js
const seedProducts = [
    {
        name: 'Chocolate Whole Milk',
        price: 1.99,
        category: 'dairy'
    },
    {
        name: 'Organic Celery',
        price: 1.49,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Fairy Eggplant',
        price: 1.99,
        category: 'vegetable'
    },
    {
        name: 'Organic Seedless Watermelon',
        price: 3.49,
        category: 'fruit'
    },
    {
        name: 'Strawberry Whole Milk',
        price: 1.99,
        category: 'dairy'
    }
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });
```

And now let's run this file

```
$ node seeds.js
MONGO CONNECTION OPEN!!!
[
  {
    _id: 5fb57be03ea7c131e03beaef,
    name: 'Chocolate Whole Milk',
    price: 1.99,
    category: 'dairy',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf0,
    name: 'Organic Celery',
    price: 1.49,
    category: 'vegetable',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf1,
    name: 'Organic Goddess Melon',
    price: 4.99,
    category: 'fruit',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf2,
    name: 'Fairy Eggplant',
    price: 1.99,
    category: 'vegetable',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf3,
    name: 'Organic Seedless Watermelon',
    price: 3.49,
    category: 'fruit',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf4,
    name: 'Strawberry Whole Milk',
    price: 1.99,
    category: 'dairy',
    __v: 0
  }
]
```

### 2.3 Final Codes

#### 2.3.1 index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/dog', (req, res) => {
    res.send('WOOF!');
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

#### 2.3.2 product.js

```js
const mongoose = require('mongoose');

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
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
```

### 2.3.3 seeds.js

```js
const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONOG CONNECTION ERROR!!!!');
        console.log(error)
    });

// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// });

// p.save()
//     .then(p => {
//         console.log(`New data created: ${p}`)
//     })
//     .catch(error => {
//         console.log(error)
//     });

const seedProducts = [
    {
        name: 'Chocolate Whole Milk',
        price: 1.99,
        category: 'dairy'
    },
    {
        name: 'Organic Celery',
        price: 1.49,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Fairy Eggplant',
        price: 1.99,
        category: 'vegetable'
    },
    {
        name: 'Organic Seedless Watermelon',
        price: 3.49,
        category: 'fruit'
    },
    {
        name: 'Strawberry Whole Milk',
        price: 1.99,
        category: 'dairy'
    }
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });
```

## 3. Products Index

Let's change our first `app.get()` route to the one down below

```js
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.send('ALL PRODUCTS WILL BE HERE');
    console.log(products)
});
```

And now let's run our `index.js`

```
$ node index.js
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
[
  {
    _id: 5fb5791fcd7ca355a4ae067f,
    name: 'Ruby Grapefruit',
    price: 1.99,
    category: 'fruit',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaef,
    name: 'Chocolate Whole Milk',
    price: 1.99,
    category: 'dairy',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf0,
    name: 'Organic Celery',
    price: 1.49,
    category: 'vegetable',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf1,
    name: 'Organic Goddess Melon',
    price: 4.99,
    category: 'fruit',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf2,
    name: 'Fairy Eggplant',
    price: 1.99,
    category: 'vegetable',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf3,
    name: 'Organic Seedless Watermelon',
    price: 3.49,
    category: 'fruit',
    __v: 0
  },
  {
    _id: 5fb57be03ea7c131e03beaf4,
    name: 'Strawberry Whole Milk',
    price: 1.99,
    category: 'dairy',
    __v: 0
  }
]
```

We will use the async callback all the time. The logic of waiting for something to comeback from mongoose and then responding, we do that all the time

In our *views* directory, we will make another path, *products/index.ejs* and add this to test it out. 

```html
<h1>All Products</h1>
```

We will change our route just a bit

```js
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    res.render('products/index');
});
```

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img3.jpg?raw=true)

Now we will pass in our products

```js
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});
```

And in our `index.ejs`, we will add some code to display the product names

```html
<ul>
    <% for(let product of products) { %> 
        <li><%= product.name %></li>
    <% } %>
</ul>
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img4.jpg?raw=true)

## 4. Product Details

### 4.1 Our Route

Let's put this code in our `index.js`

```js
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product)
    res.send('details page!')
})
```

Now we will take a product ID and put that in our URL. We should get this page

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img5.jpg?raw=true)

And now we get this in our console

```
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
{
  _id: 5fb5791fcd7ca355a4ae067f,
  name: 'Ruby Grapefruit',
  price: 1.99,
  category: 'fruit',
  __v: 0
}
```

Now instead of just finding that product, what we're gonna do is render a template. Let's fix that route just a bit

```js
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product});
})
```

### 4.2 Our View (show.ejs)

And now we will make our `show.ejs` file with these contents

```html
<h1><%= product.name %></h1>
<ul>
    <li>Price: $<%= product.price %> </li>
    <li>Price: <%= product.category %> </li>
</ul>
```

### 4.3 Fixing index.ejs

Let's change our `index.ejs` file a bit so that we have links to all of the products

```html
<ul>
    <% for(let product of products) { %> 
        <li><a href="/products/<%=product._id%>"><%= product.name %> </a></li>
    <% } %>
</ul>
```

Now we get this as a result, where all products have their own link and each link takes you to their own page

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img6.jpg?raw=true)

### 4.4 Final Codes

#### 4.4.1 index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product});
})

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

#### 4.4.2 show.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= product.name %></title>
</head>
<body>
    <h1><%= product.name %></h1>
    <ul>
        <li>Price: $<%= product.price %> </li>
        <li>Price: <%= product.category %> </li>
    </ul>
    <a href="/products">All Products</a>
</body>
</html>
```

#### 4.4.3 index.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Products</title>
</head>
<body>
    <h1>All Products!</h1>
    <ul>
        <% for(let product of products) { %> 
            <li><a href="/products/<%=product._id%>"><%= product.name %> </a></li>
        <% } %>
    </ul>
</body>
</html>
```

## 5. Creating Products

We will create a form that is used for creating products. This will require two routes: a GET and a POST

### 5.1 GET Request and Our Form

Our template will be called `new.ejs`

```js
app.get('/products/new', (req, res) => {
    res.render('products/new')
});
```

Here is the content in `new.ejs`

```html
<form action="/products" method="post">
    <label for="name">Product Name</label>
    <input type="text" name="name" placeholder="Product Name" id="name">
    <label for="price">Price (Unit)</label>
    <input type="number" name="price" placeholder="Product Name" id="price">
    <label for="category">Select Category</label>
    <select name="category" id="category">
        <option value="fruit">Fruit</option>
        <option value="vegetable">Vegetable</option>
        <option value="dairy">Dairy</option>
    </select>
    <button>Submit</button>
</form>
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img7.jpg?raw=true)

### 5.2 POST Request

Now we will set up a route to submit our data

```js
app.post('/products', (req,res) => {

});
```

Now remember we want info from the POST request body, but we don't have access to `req.body` immediately; well, it's there, but it's not parsed. We need to tell Express to use middleware

```js
app.use(express.urlencoded({extended: true}));
```

Now let's fill in that 

```js
app.post('/products', (req,res) => {
    console.log(req.body);
    res.send('making your product!')
});
```

And then we will test out this form 

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img9.jpg?raw=true)

This is the output in the console

```
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
{ name: 'Cucumber', price: '3', category: 'vegetable' }
```

### 5.3 Creating The Product

Now we will make an actual product itself. We will do that in our POST request

```js
app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.send('making your product!')
});
```

The thing is that we aren't making any validations with `req.body`. There could be more information in there that we don't need. But we'll just do this for now

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img10.jpg?raw=true)

```
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
{
  _id: 5fb96c97d63aec4c1c1c33f1,
  name: 'Heirloom Tomato',
  price: 2,
  category: 'fruit',
  __v: 0
}d
```

### 5.4 Redirecting

Now we will redirect to the product's page after it has been created

```js
app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img11.jpg?raw=true)

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img12.jpg?raw=true)

### 5.5 Final Codes 

#### 5.5.1 index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});

app.get('/products/new', (req, res) => {
    res.render('products/new')
});

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product});
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

#### 5.5.2 new.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Product</title>
</head>
<body>
    <h1>Add A Product</h1>
    <form action="/products" method="post">
        <label for="name">Product Name</label>
        <input type="text" name="name" placeholder="Product Name" id="name">
        <label for="price">Price (Unit)</label>
        <input type="number" name="price" placeholder="Product Name" id="price">
        <label for="category">Select Category</label>
        <select name="category" id="category">
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="dairy">Dairy</option>
        </select>
        <button>Submit</button>
    </form>
</body>
</html>
```

## 6. Updating Products

### 6.1 Edit Form

We will have a GET request route that will serve the edit form 

```js
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product})
});
```

And then we will make our new `edit.ejs` template. We will basically copy the form from `new.ejs` and make some minor adjustments to it. Notice the `form action` and the `value` for the first input

```html
<form action="/products/<%=product._id%>" method="post">
    <label for="name">Product Name</label>
    <input type="text" name="name" placeholder="Product Name" id="name" value="<%=product.name%> ">
    <label for="price">Price (Unit)</label>
    <input type="number" name="price" placeholder="Product Name" id="price" value="<%=product.price%>">
    <label for="category">Select Category</label>
    <select name="category" id="category">
        <option value="fruit">Fruit</option>
        <option value="vegetable">Vegetable</option>
        <option value="dairy">Dairy</option>
    </select>
    <button>Submit</button>
</form>
```
![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img13.jpg?raw=true)

As you can see, the form has prefilled data. We don't have a `value` attribute yet for the category, but we'll get to that later

### 6.2 PUT Request

Now let's make our PUT request because we are taking everything from the form and updating one or more attributes. We will test out our request with this code below:

```js
app.put('/products/:id', async (req,res) => {
    console.log(req.body);
    res.send('PUT!!!!!!!!!');
});
```

Remember that we need to install `method-override` because HTML forms only support GET and POST requests. So use `npm i method-override` and put this code in `index.js`

```js
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
```

Now in our form in `edit.ejs` put this line

```js
<form action="/products/<%=product._id%>?_method=PUT" method="post">
```

### 6.3 Testing Our Edit

And now let's test it out by changing the category of a banana to "dairy"

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img14.jpg?raw=true)

```
APP IS LISTENING ON PORT 3000
MONGO CONNECTION OPEN!!!
{ name: 'Banana ', price: '3', category: 'dairy' }
```

So now we need to write the logic of updating a product using Mongoose by updating our PUT request

```js
app.put('/products/:id', async (req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`)
});
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img15.jpg?raw=true)

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img16.jpg?raw=true)

Let's add this link in `show.ejs` so that it takes us to the edit page

```html
<a href="/products/<%=product._id%>/edit">Edit Product</a>
```

### 6.4 Final Codes

#### 6.4.1 index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;
const methodOverride = require('method-override');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});

app.get('/products/new', (req, res) => {
    res.render('products/new')
});

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product});
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product})
});

app.put('/products/:id', async (req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`)
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

#### 6.4.2 edit.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Product</title>
</head>
<body>
    <h1>Edit Product</h1>
    <form action="/products/<%=product._id%>?_method=PUT" method="POST">
        <label for="name">Product Name</label>
        <input type="text" name="name" placeholder="Product Name" id="name" value="<%=product.name%> ">
        <label for="price">Price (Unit)</label>
        <input type="number" name="price" placeholder="Product Name" id="price" value="<%=product.price%>">
        <label for="category">Select Category</label>
        <select name="category" id="category">
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="dairy">Dairy</option>
        </select>
        <button>Submit</button>
    </form>
    <a href="/products/<%=product._id%>">Cancel</a>
</body>
</html>
```

## 7. Tangent On Category Selector

### 7.1 Hardcoding to Solve the Problem

In this section, we will fix the form by correctly showing the current category of the product when trying to edit it. In the `<option>` tag of the dropdown menu, we need to add a boolean value called `selected`.

```html
<option value="dairy" selected>Dairy</option>
```

Now when we refresh, we see that dairy is automatically selected

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img17.jpg?raw=true)

What we need to do is dynamically apply the `selected` attribute depending on the type of product it is. We will need to use EJS inside of the `<option>` opening tab and use ternary operators

```html
<option value="fruit" <%=product.category === 'fruit' ? 'selected' : ''%> >Fruit</option>
<option value="vegetable" <%=product.category === 'vegetable' ? 'selected' : ''%>>Vegetable</option>
<option value="dairy" <%=product.category === 'dairy' ? 'selected' : ''%>>Dairy</option>
```

It works, but it's pretty ugly. And if we add more categories, it'll be a nightmare. But let's refresh the page and we can see now that it works

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img18.jpg?raw=true)

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img19.jpg?raw=true)

### 7.2 Dynamic Solution

Let's fix the clunkyness of this. Instead of typing one of these manually, it's better to use a loop. In our `index.js`, we will make a list of categories. We will then pass them through the `/new` and `/edit`

```js
const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
});
```

```html
<select name="category" id="category">
    <% for(let category of categories) {%> 
        <option value="<%=category%>"><%= category %> </option>
    <% } %> 
</select>
```

Now let's check the Add Product form to see if it still works

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img20.jpg?raw=true)

Let's inspect the element to see what it shows us

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img21.jpg?raw=true)

So if we add new categories (or remove them), the dropdown menu will automatically update. Let's add fungi to our `categories` list

![img22](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img22.jpg?raw=true)

Now let's fix our "edit products" form. We will reuse what we had in our "add product" form

```js
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product, categories})
});
```

```html
<% for(let category of categories) {%> 
    <option value="<%=category%>" <%=product.category === category ? 'selected' : ''%> ><%= category %> </option>
<% } %>
```

Now let's test this out

![img23](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img23.jpg?raw=true)

![img24](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img24.jpg?raw=true)

### 7.3 Final Codes

#### 7.3.1 index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;
const methodOverride = require('method-override');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
});

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product});
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product, categories})
});

app.put('/products/:id', async (req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`)
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

### 7.3.2 edit.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Product</title>
</head>
<body>
    <h1>Edit Product</h1>
    <form action="/products/<%=product._id%>?_method=PUT" method="POST">
        <label for="name">Product Name</label>
        <input type="text" name="name" placeholder="Product Name" id="name" value="<%=product.name%> ">
        <label for="price">Price (Unit)</label>
        <input type="number" name="price" placeholder="Product Name" id="price" value="<%=product.price%>">
        <label for="category">Select Category</label>
        <select name="category" id="category">
            <% for(let category of categories) {%> 
                <option value="<%=category%>" <%=product.category === category ? 'selected' : ''%> ><%= category %> </option>
            <% } %> 
        </select>
        <button>Submit</button>
    </form>
    <a href="/products/<%=product._id%>">Cancel</a>
</body>
</html>
```

### 7.3.3 index.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Products</title>
</head>
<body>
    <h1>All Products!</h1>
    <ul>
        <% for(let product of products) { %> 
            <li><a href="/products/<%=product._id%>"><%= product.name %> </a></li>
        <% } %>
    </ul>
    <a href="/products/new">New Product</a>
</body>
</html>
```

### 7.3.4 new.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Product</title>
</head>
<body>
    <h1>Add A Product</h1>
    <form action="/products" method="post">
        <label for="name">Product Name</label>
        <input type="text" name="name" placeholder="Product Name" id="name">
        <label for="price">Price (Unit)</label>
        <input type="number" name="price" placeholder="Product Name" id="price">
        <label for="category">Select Category</label>
        <select name="category" id="category">
            <% for(let category of categories) {%> 
                <option value="<%=category%>"><%= category %> </option>
            <% } %> 
        </select>
        <button>Submit</button>
    </form>
</body>
</html>
```

## 8. Deleting Products

### 8.1 Our DELETE Request

Let's add this code in our `show.ejs` to have our delete button

```html
<form action="/products/<%=product._id%>?_method=DELETE" method="post">
    <button>Delete</button>
</form>
```

![img25](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img25.jpg?raw=true)

![img26](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img26.jpg?raw=true)

Now we need to set up a DELETE route for this button

```js
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProdcut = await Product.findByIdAndDelete(id);
    res.redirect('/products');
});
```

![img27](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img27.jpg?raw=true)

![img28](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img28.jpg?raw=true)

![img29](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img29.jpg?raw=true)

### 8.2 Final Codes

#### 8.2.1 index.js

```js
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const portNumber = 3000;
const methodOverride = require('method-override');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONGO CONNECTION ERROR!!!!');
        console.log(error)
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
});

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
});

app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product});
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product, categories})
});

app.put('/products/:id', async (req,res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`)
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProdcut = await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.listen(portNumber, () => {
    console.log(`APP IS LISTENING ON PORT ${portNumber}`)
});
```

### 8.2.2 show.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= product.name %></title>
</head>
<body>
    <h1><%= product.name %></h1>
    <ul>
        <li>Price: $<%= product.price %> </li>
        <li>Price: <%= product.category %> </li>
    </ul>
    <a href="/products">All Products</a>
    <a href="/products/<%=product._id%>/edit">Edit Product</a>
    <form action="/products/<%=product._id%>?_method=DELETE" method="post">
        <button>Delete</button>
    </form>
</body>
</html>
```

## 9. Filtering By Category

### 9.1 Fixing GET Products

The route that we would do will be the one below

```
/products?category=dairy
```

We would get all categories, then we will divide them using our query string

In our `show.ejs`, we will make the product's category a link, which will take you to a page that shows all products of that category

![img30](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img30.jpg?raw=true)

In our `index.js` we will extract the category from the query string and that for filter our products

```js
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({category});
        res.render('products/index', {products});
    } else {
        const products = await Product.find({});
        res.render('products/index', {products});
    }
});
```

![img31](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img31.jpg?raw=true)

![img32](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img32.jpg?raw=true)

![img33](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img33.jpg?raw=true)

### 9.2 Improving UX

#### 9.2.1 Fixing h1 Tag

Let's improve the code a bit. Notice how the `<h1>` tag says "All Products!" in each of the categories. Let's pass in the name of the category and use EJS to replace it

```js
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({category});
        res.render('products/index', {products, category});
    } else {
        const products = await Product.find({});
        res.render('products/index', {products, category: 'all'});
    }
});
```

Then we will add this in our `index.ejs`

```html
<h1><%= category %> Products!</h1>
```

![img34](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img34.jpg?raw=true)

#### 9.2.2 Linking Back to All Products

Let's add this code in our `index.ejs` so that it links us back to all the products

```html
<a href="/products">All Products</a>
```

![img35](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img35.jpg?raw=true)

![img36](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img36.jpg?raw=true)

The problem is that the link to all products still shows when we are viewing all products. Let's improve our `index.ejs` with this code below:

```html
<% if(category !== 'All') { %> 
    <a href="/products">All Products</a>
<% } %> 
```

![img37](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/37-Mongoose-With-Express/img-for-notes/img37.jpg?raw=true)