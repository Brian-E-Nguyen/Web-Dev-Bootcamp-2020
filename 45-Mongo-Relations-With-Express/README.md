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