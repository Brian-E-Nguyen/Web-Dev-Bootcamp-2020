# 33. Creating Dynamic HTML With Templating

## 1. What is Templating?

Each subreddit page follows a pattern. They have a theme, "about community" box, members online, posts, join button, etc. These are not created by hand one at a time. Instead, **templates** are used.

**Templating** allows us to define a preset "pattern" for a webpage that we can dynamically modify with. For example, we could define a single "Search" template that displays all the results for a given search term. We don't know what the term is or how many results there are ahead of time. The webpage is created on the fly. The end-goal is to use logic to create HTML pages

We will be using **Embedded JavaSccript (EJS)** for this course because it's very popular and it uses actual JavaScript syntax. You wouldn't have to learn new syntax.

## 2. Configuring Express for EJS

### 2.1 Setting Up Our Files

We will be making a new folder called "Templating_Demo" to work with EJS. In this folder, we will

1. Run `npm init -y`
2. Run `npm i express`
3. Create an `index.js` file

Our `index.js` file will now look like this:

```js
// index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('HI');
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

### 2.2 `app.set()`

Now we will tell our app to use EJS. There is a particular method on `app` called `app.set()` and it accepts two arguments: the key and the value

```js
// index.js
const express = require('express');
const app = express();

// new piece of code
app.set('view engine', 'ejs');

......
```

The next thing we will need to do is install EJS with `npm i ejs`.

We don't need to require it in `index.js` because we already have `app.set('view engine', 'ejs');`. Express will require it behind the scenes.

### 2.3 Our `.ejs ` File

By default, when we have EJS, Express will assume that our views and templates already exist in a directory called "views". So now we'll create a new directory called "views" and a new file in it called `home.ejs` (extension must be `.ejs`). We will then add basic HTML in this file

```html
<!-- home.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>The homepage!</h1>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit cum aut quod nisi mollitia qui delectus deleniti eum blanditiis, provident optio laudantium dolorem quia, possimus perferendis consectetur, aliquam excepturi error.</p>
</body>
</html>
```

### 2.4 `res.render()`

For our `app.get()` in our `index.js` file, instead of sending back a string, we can send back a file or a template; the method we use for this is `app.render()`, and we pass in the file name as a string

```js
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home.ejs');
});
```

We don't need to have the extension name or say `views/home.ejs` because it already assumes that it is an `.ejs` file and that it is in the "views" directory. 

Now let's run our `index.js` file

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img1.jpg?raw=true)
