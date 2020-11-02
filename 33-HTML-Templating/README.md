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

### 2.5 Final Code

```js
// index.js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

## 3. Setting the Views Directory

### 3.1 The Problem

One minor issue that we should address, which is something that you may encounter, is that the default views directory is only going to work if we are running the application from within the same directory where the view folder is.

To explain this, if we are outside our "Templating_Demo" folder and we run our `index.js` file...

```
$ nodemon Templating_Demo/index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node Templating_Demo/index.js`
LISTENING ON PORT 3000
```

...it works just fine. But if we were to go to `localhost:3000`, we get this:

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img2.jpg?raw=true)

Notice the path on the first line of the error. It shows the wrong path

`C:\Users\BRIAN\Desktop\Web-Dev-Bootcamp-2020\33-HTML-Templating\views`

EJS just appends "views" to our current working directory.

### 3.2 The Solution

If we want it to work when we're outside of the directory, then we would need to change the "views" directory. In our `index.js` file, we would have to require a new package called `path` and then create another `app.set()`


```js
// index.js
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

......
```

What we've done now is instead of being the current working directory where I executed the file from wher I was located, we are telling Node to execute the file from where `index.js` is located. Let's run it now. Note the `nodemon` execution line

```
$ nodemon Templating_Demo/index.js
[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node Templating_Demo/index.js`
LISTENING ON PORT 3000
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img1.jpg?raw=true)

### 3.3 Final Code

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

## 4. EJS Interpolation Syntax

The EJS has "tags" which are listed below and on the official documents

- `<%` 'Scriptlet' tag, for control-flow, no output
- `<%_` ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
- `<%=` Outputs the value into the template (HTML escaped)
- `<%-` Outputs the unescaped value into the template
- `<%#` Comment tag, no execution, no output
- `<%%` Outputs a literal '<%'
- `%>` Plain ending tag
- `-%>` Trim-mode ('newline slurp') tag, trims following newline
- `_%>` ‘Whitespace Slurping’ ending tag, removes all whitespace after it

These tags indicate EJS, in that they are not treated as HTML. The first one we will see is `<%=`. In our `home.ejs`, we will change our `<h1>`

```html
<h1>The homepage <%= %>!</h1>
```

Whatever we put in there will be treated as JavaScript, so we could put `4 + 5` and that will evaluate to 9

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img3.jpg?raw=true)

## 5. Passing Data to Templates

### 5.1 Intro

We will define a new route in our `index.js` file. This will generate us a new number

```js
app.get('/rand', (req, res) => {
    res.render('random')
});
```

And inside of our new `random.ejs` file, we will have this in our body:

```html
<h1>Your random number is: <%= Math.floor(Math.random() * 10) + 1 %></h1>
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img4.jpg?raw=true)

Now this does work. It randomly generates a number everytime we refresh the page, but generally we want to remove as much logic as possible from our templates. Our templates should only display things. What we should do is generate a number from an outside source, and then pass it into the template.

### 5.2 How to Pass Data Into Templates

What we should do in our `index.js` file is to generate a random number in our `app.get()` code block. In our `res.render()` line, we can pass in a second argument, which is an object that is a key-value pair

```js
// index.js
app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', {rand: num});
});
```

Whatever `num` is, it will be associated as `rand`, and we use that in our `random.ejs` file

```html
<h1>Your random number is: <%= rand %></h1>
```

The page still works now with a much more simple template. 

You don't have to define the object as a key-value pair. You can just pass in the variable itself

```js
// index.js
app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', {num});
});
```

```html
<h1>Your random number is: <%= num %></h1>
```

### 5.3 Final Codes

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', {rand: num});
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random</title>
</head>
<body>
    <h1>Your random number is: <%= rand %></h1>
</body>
</html>
```

## 6. Subreddit Template Demo

We will now create a new subreddit route in our `index.js` file

```js
// index.js
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.render('subreddit', { subreddit })
});
```

In our new `subreddit.ejs` file, we have the passed-in value (subreddit) in our title and our `<h1>` tag 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= subreddit %> </title>
</head>
<body>
    <h1>Browsing The <%= subreddit %> subreddit</h1>
</body>
</html>
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img5.jpg?raw=true)

## 7. Conditionals in EJS

### 7.1 Intro

The `<% %>` EJS operator allows us to add JS logic without having anything actually rendered as a result. Going back to our /rand page, let's say we want something to display depending on what number we get. If we get an even number, then the page displays we have an even number; else, display we have an odd number.

To do this, our `random.ejs` file will have is this code block:

```html
<!-- random.ejs -->
<h1>Your random number is: <%= num %></h1>
<% if(num % 2 === 0) { %> 
    <h2>That is an even number!</h2>
<% } %> 
```

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img6.jpg?raw=true)

And to show that the `<h2>` tag doesn't display when we get an odd number:

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img7.jpg?raw=true)

We can add an `else` of course. 

```html
<!-- random.ejs -->
<h1>Your random number is: <%= num %></h1>
<% if(num % 2 === 0) { %> 
    <h2>That is an even number!</h2>
<% } else { %> 
    <h2>That is an odd number!</h2>
<% } %> 
```

We can also add a ternary operator to make things simpler

```html
<h3><%= num % 2 === 0 ? 'EVEN' : 'ODD' %> </h3>
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img8.jpg?raw=true)

### 7.2 Final Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Random</title>
</head>
<body>
    <h1>Your random number is: <%= num %></h1>
    <% if(num % 2 === 0) { %> 
        <h2>That is an even number!</h2>
    <% } else { %> 
        <h2>That is an odd number!</h2>
    <% } %> 
    <h3><%= num % 2 === 0 ? 'EVEN' : 'ODD' %> </h3>
</body>
</html>
```

## 8. Loops in EJS

### 8.1 Setting Up Our New Route

Another thing we use templates for all the time is looping for creation of very similar content, like thousands of posts that follows the same format. We can use a template to loop through all of the data.

Let's set up a route called "cats" in our `index.js` file and have a fake database of cats

```js
// index.js
app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ];
});
```

Now we want to pass the `cats` db through our new `cats.ejs` template

```js
app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ];
    res.render('cats', {cats})
});
```

```html
<!-- cats.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Cats!</title>
</head>
<body>
    <h1>All The Cats</h1>
    <p><%= cats %> </p>
</body>
</html>
```

This will be our output:

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img9.jpg?raw=true)

### 8.2 How to Use Loops

Obviously this looks bad. What if we take each cat and have their own `<li>` tag? It will look nicer. We would have to use a loop like this:

```html
<ul>
    <% for (let cat of cats) { %> 
        <li><%= cat %></li>
    <% } %> 
</ul>
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img10.jpg?raw=true)

### 8.3 Final Codes

#### 8.3.1 cats.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Cats!</title>
</head>
<body>
    <h1>All The Cats</h1>
    <ul>
    <% for (let cat of cats) { %> 
        <li><%= cat %></li>
    <% } %> 
    </ul>
</body>
</html>
```

#### 8.3.2 index.js

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ];
    res.render('cats', {cats})
});

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    res.render('subreddit', { subreddit })
});

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', {num});
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

## 9. More Complex Subreddit Demo

### 9.1 Intro

We now have a new `data.json` file that we will use to display data onto our subreddits. We will have to require it in our `index.js` file

```js
// index.js
const redditData = require('./data.json');
```

In our `r/subreddit` route, we will extract one subreddit to demonstrate

```js
// index.js
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    res.render('subreddit', { subreddit })
});
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img11.jpg?raw=true)

### 9.2 Spreading Data

Instead of just passing the data itself as an object, we'll spread it into the object that we pass in. This allows us to access individual properties like name, subscribers, description, posts, etc.

To do this, we have to add three periods before the variable like this:

```js
// index.js
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    res.render('subreddit', { ...data });
});
```

Now in our `subreddit.ejs` file, we have access to stuff like `name`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Look right here -->
    <title><%= name %> </title>
</head>
<body>
    <!-- and here -->
    <h1>Browsing The <%= name %> subreddit</h1>
    <h2><%= description %> </h2>
</body>
</html>
```

And it still works

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img12.jpg?raw=true)

We can use other key-values as well, like `description`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= name %> </title>
</head>
<body>
    <h1>Browsing The <%= name %> subreddit</h1>
    <h2><%= description %> </h2>
    <p><%= subscribers %> total subscribers</p>
    <hr>
    <% for (let post of posts) { %> 
        <article>
            <h3><%= post.title %> </h3>
        </article>
    <% } %> 
</body>
</html>
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img13.jpg?raw=true)

This, of course, works on other subreddits as well

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img14.jpg?raw=true)

### 9.3 Adding More To Subreddit Posts

Let's make the posts look prettier by formating the titles and adding images

```html
<% for (let post of posts) { %> 
    <article>
        <p><%= post.title %> - <b><%= post.author %> </b></p>
        <% if (post.img) { %> 
            <img src="<%= post.img %>" alt="">
        <% } %> 
    </article>
<% } %> 
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img15.jpg?raw=true)

### 9.4 Render Page If Data Exists

A little thing that we can do to fix our codes is a conditional to render the page *if* we have data

```js
// index.js
app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if(data){
        res.render('subreddit', { ...data });
    }
    else {
        res.render('notfound', {subreddit})
    }
});
```

```html
<!-- notfound.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Not Found</title>
</head>
<body>
    <h1><%= subreddit %> subreddit not found!</h1>
</body>
</html>
```

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img16.jpg?raw=true)

### 9.5

#### 9.5.1 index.js

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ];
    res.render('cats', {cats})
});

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if(data){
        res.render('subreddit', { ...data });
    }
    else {
        res.render('notfound', {subreddit})
    }
});

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', {num});
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

#### 9.5.2 subreddit.ejs

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= name %> </title>
</head>
<body>
    <h1>Browsing The <%= name %> subreddit</h1>
    <h2><%= description %> </h2>
    <p><%= subscribers %> total subscribers</p>
    <hr>
    <% for (let post of posts) { %> 
        <article>
            <p><%= post.title %> - <b><%= post.author %> </b></p>
            <% if (post.img) { %> 
                <img src="<%= post.img %>" alt="">
            <% } %> 
        </article>
    <% } %> 
</body>
</html>
```

#### 9.5.3 notfound.ejs

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Not Found</title>
</head>
<body>
    <h1><%= subreddit %> subreddit not found!</h1>
</body>
</html>
```

## 10. Serving Static Assets in Express

### 10.1 How To Serve Static Assets

Serving **static files** refer to things like CSS and JS files that we want to include in the response back to client-side

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img17.jpg?raw=true)

To do this, we need to use something called `express.static()`. It's known as middleware. 

[Link to serving static files docs](https://expressjs.com/en/starter/static-files.html)

We pass in the argument the folder of files that we want to pass in.

`app.use(express.static('public))`

We will place this in our `index.js`

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');

app.use(express.static('public'));

...
```

We will now make an `app.css` file inside of the "public" directory

```css
/* app.css */
body {
    background-color: aqua;
}
```

Now we have to refer to that stylesheet inside one of our templates

```html
<!-- subreddit.ejs -->
<link rel="stylesheet" href="/app.css">
```

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img18.jpg?raw=true)

### 10.2 Running index.js Outside of the CWD

If we were to run index.js outside of our CWD, then it wouldn't run because it couldn't find `app.css`. We can do the exact same thing with 

`app.set('views', path.join(__dirname, '/views'))`

--

`app.use(express.static('public'));` 

will now be 

`app.use(express.static(path.join(__dirname, 'public')));`

And it still works

### 10.3 Final Codes

#### 10.3.1 index.js

```js
// index.js
const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/cats', (req, res) => {
    const cats = [
        'Blue', 'Rocket', 'Monty', 'Stephanie', 'Winston'
    ];
    res.render('cats', {cats})
});

app.get('/r/:subreddit', (req, res) => {
    const { subreddit } = req.params;
    const data = redditData[subreddit];
    if(data){
        res.render('subreddit', { ...data });
    }
    else {
        res.render('notfound', {subreddit})
    }
});

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1
    res.render('random', {num});
});

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});
```

#### 10.3.2 subreddit.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= name %> </title>
    <link rel="stylesheet" href="/app.css">
</head>
<body>
    <h1>Browsing The <%= name %> subreddit</h1>
    <h2><%= description %> </h2>
    <p><%= subscribers %> total subscribers</p>
    <hr>
    <% for (let post of posts) { %> 
        <article>
            <p><%= post.title %> - <b><%= post.author %> </b></p>
            <% if (post.img) { %> 
                <img src="<%= post.img %>" alt="">
            <% } %> 
        </article>
    <% } %> 
</body>
</html>
```

## 11. Bootstrap + Express

In this section, we've copied the *Templating_Demo* folder and renamed it *Bootstrap_Demo* so that we can compare them before and after; however, we did remove the contents in the *public* directory to include Bootstrap. We will add *public/js* and *public/css* in those directories. 

Then, we will download Bootstrap compiled CSS and JS. Inside of *public/css*, we will take the `bootstrap.min.css` file that we've downloaded and place it into that directory. Similarly, inside of *public/js*, we will put the `bootstrap.min.js` file into that directory

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img19.jpg?raw=true)

We will now work with our `subreddit.js` file and change the `<link>` tag. We need to change `href` with this path and now we will have a new `<script>` tag inside of this file

```html
<link rel="stylesheet" href="/css/bootstrap.min.css">
<script src="/js/bootstrap.min.js"></script>
```

When we run the server, we can see that the font changed, indicating that we loaded Bootstrap successfully (kindof)

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img20.jpg?raw=true)

If we look into the console, it gives us an error. Bootstrap still requires jQuery, so we will load the jQuery file into our *public/js* directory and require it

```html
<script src="/js/jquery.js"></script>
<script src="/js/bootstrap.min.js"></script>
```

Let's take a navbar template and past it into our `subreddit.ejs` file

[Link to Bootstrap navbar](https://getbootstrap.com/docs/4.0/components/navbar/)

In our navbar component, we will change a few things

The href link for home will be from `#` to `/` so that it can actually take us home. We can also list our other routes as well

```html
<div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="/rand">Random</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="/r/chickens">Chickens</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="/r/soccer">Soccer</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="/r/mightyharvest">Mighty Harvest</a>
    </li>
    </ul>
</div>
```

And now everything works

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img21.jpg?raw=true)

## 12. EJS & Partials

### 12.1 Intro

If we want to use the same HTML code on other pages, like

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= name %> </title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <script src="/js/jquery.js"></script>
    <script src="/js/bootstrap.min.js"></script>
</head>
```

We would have to duplicate all of this on many pages, and it can be very tiresome. What we will do is create some templates, which will then be included in the pages that we need.

### 12.2 How to Include Partials

First we will cut out this code in our `subreddit.ejs` file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Demo</title>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <script src="/js/jquery.js"></script>
    <script src="/js/bootstrap.min.js"></script>
</head>
```

Then we will make a new directory called *views/partials*, add a new file called `head.ejs`, and paste that code inside of it.

How we can include this file inside of our `subreddit.ejs` file is to use the `<%- %>` tag following this pattern.

```html
<ul>
  <% users.forEach(function(user){ %>
    <%- include('user/show', {user: user}); %>
  <% }); %>
</ul>
```

We will now have this code at the top of the `subreddit.ejs`

```html
<%- include('partials/head') %> 
```

And everything still works

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/33-HTML-Templating/img-for-notes/img21.jpg?raw=true)

We can also make a template for our navbar as well. We'll cut the code from our 
