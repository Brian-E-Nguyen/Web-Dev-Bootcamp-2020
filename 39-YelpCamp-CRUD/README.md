# Section 39 - YelpCamp: Campgrounds CRUD

## 1. YelpCamp: Our Massive project

We will take everything we have learned to build a massive app called __YelpCamp__

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img1.jpg?raw=true)

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img3.jpg?raw=true)

## 2. Access to YelpCamp Code

https://github.com/Colt/YelpCamp/tree/c12b6ca9576b48b579bc304f701ebb71d6f9879a

When you download it, be sure to run `npm install` to get all of the packages and dependencies

Each sections has its own code. If you want to see thhe differences between codes, click on the commit ID to see the git diff

## 3. Creating the Basic Express App

### 3.1 Initializing Our App

We'll be creating our express app inside of the _YelpCamp_ folder so we can easily transfer it to other sections

1. `npm init -y`
2. `npm i express mongoose ejs`
3. Make `app.js`

And now we'll put this in our `app.js` and test it out

```js
const express = require('express');
const app = express();
const portNumber = 3000;

app.get('/', (req, res) => {
    res.send('HELLO FROM YELPCAMP')
});

app.listen(portNumber, () => {
    console.log(`SERVING ON PORT ${portNumber}`);
});
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img4.jpg?raw=true)

### 3.2 Views Directory

Now let's make our initial view file called `home.ejs` which will be inside of our _views_ directory. We'll now update our `app.js` file to include using the EJS view engine and setting our home path to use `home.ejs`

```js
const express = require('express');
const app = express();
const portNumber = 3000;
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
});

app.listen(portNumber, () => {
    console.log(`SERVING ON PORT ${portNumber}`);
});
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/39-YelpCamp-CRUD/39-YelpCamp-CRUD/img-for-notes/img5.jpg?raw=true)