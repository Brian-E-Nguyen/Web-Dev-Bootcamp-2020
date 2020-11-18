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