# 37. Mongoose With Express

## 1. Express + Mongoose Setup

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
        console.log('OH NO, MONOG CONNECTION ERROR!!!!');
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