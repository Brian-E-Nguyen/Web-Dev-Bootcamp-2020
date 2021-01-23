# Section 50: Authentication From Scratch

Most apps, or anything nowadays, have some sort of authentication. We will make our own authentication (authN) from scratch so that we get an idea how it works. It's really helpful to understand how all of the pieces fit together. This section has two parts:

1. how does authN work, how to store passwords, what it means to salt a password etc.
2. implementing authN in an Express app

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img1.jpg?raw=true)

## 1. Authentication vs. Authorization

**Authentication** is the process of verifying _who a particular user is_. We typically authenticate with a username/password combo, but we can also use security questions, facial recognition, etc.

**Authorization** is verifying what a specific user has access to. Generally, we authorize after a user has been authenticated. "Now that we know who you are, here is what you are allowed to do and what you're NOT allowed to do"

## 2. How to (not) Store Passwords

The #1 rule for storing passwords is to **never store passwords as is, as text, in your database.** That is a recipe for disaster

```js
{
    username: 'kittyluver',
    password: 'meowmeow999'
},
{
    username: 'geckoman',
    password: 'lizard932'
}
```

It doesn't matter what DB you are using: MySQL, Mongo, Postgres, etc. Imaginge this is Mongo as the password is. If anyone gets in your database, you're screwed. Not to mention thhat a lot of users reuse passwords from one app to the next. So if someone has one password, they can use that same password to access some other accounts from other apps

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img2.jpg?raw=true)

The solution for this is hashing the password. Rather than storing a password in the database, we run the password through a **hashing function** first and then store the result in the database

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img3.jpg?raw=true)

The outputs of the hashing function is always the same size

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img4.jpg?raw=true)

When someone logs in with this username and password, we run the password through the hash function that we used to store the hashed password and compare those two

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img5.jpg?raw=true)

## 3. Cyptographic Hashing Functions

Hashing functions are a broad use of functions. There are many different kinds out there and they don't all have to do with passwords. Below is an example of a hypothetical hash function, taken from Wikipedia. It takes an input and turns it into a 2-digit number from 0 to 15. This is a very simple version that has 16 possible outputs. It doesn't matter what your username or password is; the result will be one out of the possible 16 outputs, so it wouldn't take long for someone to guess the password

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img6.jpg?raw=true)

When we talk about ***cryptographic* hashing functions**, we care about password safety. 

### 3.1 One-Way Hash Function, Which is Infeasible to Invert

It can be pretty tricky to wrap your head around this. In math, absolute value will take any number, positive or negative, and return the positive value of it. In JavaScript, `Math.abs()` is an example of a one-way function. If we pass in a variable that contains a number, the function will return the positive value of it. The thing is, we don't know if that variable is positive or negative

```js
> Math.abs(x)
< 100
```

Was the input 100 or -100? You cannot tell me definitively what the number was (it was actually -100).

### 3.2 Small Change in Input Yields Large Change in Output

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img5.jpg?raw=true)

Let's take a look at the password. If we we're to change it from 'lizard987' to 'lizard989', that should be a very large change in the output. You shouldn't be able to tell if two passwords are similar to each other just by looking at their hashed outputs. Below is an example of how slight changes in inputs yield completely different outputs

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img7.jpg?raw=true)

### 3.3 Deterministic - Same Input Yields Same Output

It would defeat the purpose of the hash function if we don't get the same output with the same input. If that happens, we can't compare the password, which is then hashed, that the user uses to log in with the one stored in the DB

### 3.4 Unlikely to Find 2 Outputs With The Same Value

When we say 'unlikely,' we mean 'very very very unlikely' but it's still possible to have a collision. Like 1 / (2^88) chance

### 3.5 Password Hash Functions are Deliberately SLOW

We want something that takes time because if we have a fast one, it'll be easy for people to brute-force their way in. Slow ones take a lot longer. There are ones that are fast, but those are not for passwords, like digital signing. 

## 4. Password Salts

### 4.1 Background; Pre-salt

1. A person can use the same password across different websites
2. Various people share the same password on a given website
3. There are only a couple hashing algorithms that are suitable for storing passwords; there aren't many out there

The hashing algorithm that we'll be using is called _Bcrypt_

Let's pretend that we're taking passwords, hashing them, and storing them in a DB. We have the password 'monkey' in the DB and its hashed version. We used the SHA 256 algorithm to make the hashed password. Then someone else has a more secured password

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img8.jpg?raw=true)

Let's duplicate the more secured password's hashed version, and let's remove the passwords so that this acts like we are looking in an actual DB, where passwords aren't stored

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img9.jpg?raw=true)

Let's say that we're a hacker and trying to figure out what the passwords are. Just by looking at the hashed passwords, we can maybe guess if the outputs are generated from Bcrypt. We can use Bcrypt and go through any of the commonly used passwords. If we are able to access one's account using a common password, then we know the password for many other users. 

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img10.jpg?raw=true)

That's a big issue. And there's another separate issue, which is if somebody knows we're using Bcrypt ahead of time, there's nothing stopping the hackers from taking Bcrypt, that list, and running each password through and getting the outputs. They could create something known as a _reverse lookup table_, where it's a file or a data structure that has something like our DB mapped to monkey

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img11.jpg?raw=true)

### 4.2 Info on Salts

**Password salts** are an extra step that we take to make it harder to reverse engineer a password. It's a random value to the password before we hash it. It helps ensure unique hashes and mitigate common attacks. Let's say we have a password 'findingnemo'., We will take that password and concatenate it with some password salt. Let's have 'LOL' as a salt and hash it. Remember that when you make a small change in the input, you get a very different output

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img12.jpg?raw=true)

We include the salt in the hashed output or we store the salt separately. We have to know that salt because when a user comes to log into our website, they provide their password, we will have to add the salt back into their password and hash it. Another reason we use salts is that if people share the same password, we can generate a different salt each time, and the hashed password will be different

## 5. Intro to Bcrypt

_Bcrypt_ is one of the most popular and recommended hashing algorithms out there. It's been around since the 1990s and is used in many different languages. There are two versions of _bcrypt_ JavaScript libraries out there: _bycrypt_ and _bcrypt.js_. The differnce is that _bcrypt.js_ is written entirely in JavaScript, which means it will run on the client-side. _bycrypt_ it's built on top of C++, does not work in the browser, made for node.js, and is a little bit faster. We'll install _bcrypt_ in our new _BcryptDemo_ folder. Make sure to do `npm init -y` first

### 5.1 bcrypt.genSalt() and bcrypt.hash()

The first methods we will talk about is `bcrypt.genSalt()` and `bcrypt.hash()`. 

- `bcrypt.genSalt()` will accept `saltRounds`, which is like a difficulty level for the hash. The ideal goal is 250ms to hash our password
- `bcrypt.hash()` will accept a password and a salt, and will generate a password

```js
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
```

Let's make our own async function to test this out

```js
const bcrypt = require('bcrypt');

const hashPassword = async() => {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
}
```

We can set any number inside of the `bcrypt.genSalt()` and we won't notice a difference in the amount of time it takes. It's generating a salt and the salt itself is going to dictate how many rounds Bcrypt needs to hash the password. It will not take any less or more time that if we did 100 rounds for example. But when we actually use that salt to hash a password, it will take hours

```
$ node index.js
$2b$10$dCW44Dio/OPLXsC.yIU56O
```

Now that we've generated a salt, let's modify our function a bit so that it accepts a password as a parameter. Then we will use our generated salt in `bcrypt.hash()` with the password

```js
const hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
    console.log(salt);
    console.log(hash);
}

hashPassword('monkey');
```

```
$ node index.js
$2b$10$Nd0omxJnm5kifJwCAo28N.
$2b$10$Nd0omxJnm5kifJwCAo28N.vlBOllmmg5LNsrHvfmwKgEkym/eBh7q
```
s
We have the salt and the entire hash. The salt is concatenated with the hash on the second line.

If we were to change the number of rounds to a higher number, it will take noticeably longer. We'll set it to 12, since that's the standard. Also notice below that we don't get the same output every time. That's because the salt is always changing

```
$ node index.js
$2b$10$KWhwY4ujQ32kN3GUyxT5X.
$2b$10$KWhwY4ujQ32kN3GUyxT5X.5cCDBcfUgkX.Bdfj964hIfhsibEOKvu

$ node index.js
$2b$15$3Wtld.dPwUUbFQ5HQflue.
$2b$15$3Wtld.dPwUUbFQ5HQflue.7dTm3cjivtGdixkka0Gg/xeWduOWcj6

$ node index.js
$2b$15$X89BWhVuDFBMMwyoT9aQlO
$2b$15$X89BWhVuDFBMMwyoT9aQlOI8k3MvGA5XlR4ztvh0BgsrF.CSTlxyC
```

### 5.2 bcypt.compare()

So now let's talk about the other side of things, which is one we have a hashed password stored somewhere, how do we verify someone's login information? How do we compare the credentials that the user sent us to the ones stored in our DB? _Bcrypt_ has a method called `bcypt.compare()` that will take a hash and figure out what the salt was, and then it will use that salt plus the password and it will run its hash; it then figures out if we get the same answer

```js
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});
```

Let's make our own login function that tests out `bcypt.compare()`. In this function, we will compare the password with the hashed password and see if they match

```js
const login = async(password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword);
    if (result) {
        console.log('Successful login!')
    }
    else {
        console.log('Try again!')
    }
}
```

We will need to run the `hashPassword()` first to generate the hashed password, then we will need to take the hashed password and feed it into our `login()` function

```js
login('monkey', '$2b$12$KqjN7s4uOmqk/DAo6r98ge8VuoEU6PPcZqgAIfUPhJxlMpwDa1MF.')
```

```
Successful login!
```

## 6. Auth Demo Setup

We will make a simple app called _AuthDemo_ where we have a couple of protected routes. There are a lot of things we will need beforehand

- Bcrypt
- EJS
- Express
- Mongoose

We will make an `index.js` file, a _models_ directory, and a _views_ directory

Let's create a `user.js` file in our _models_ directory

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
});

module.exports = mongoose.model('User', userSchema);
```

Just note that `password` is really the hashed password. Now let's set up our `index.js` and `register.ejs` files

```JS
// index.js
const express = require('express');
const app = express();
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/authDemo', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MONGOOSE CONNECTION OPEN')
}).catch(err => {
    console.log('OH NO MONGO CONNECTION ERROR!!!!!!!!!!!!!!!!!!!!');
    console.log(err)
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/register', (req, res) => {
    res.render('register')
});

app.get('/secret', (req, res) => {
    res.send('THIS IS SECRET. YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN!');
})

app.listen(3000, () => {
    console.log('SERVING YOUR APP!')
});
```

```html
...
<body>
    <h1>SIGN UP</h1>
    <form action="">
        <div>
            <label for="username"></label>
            <input type="text" name="username" id="username" placeholder="Username">
        </div>
        <div>
            <label for="password"></label>
            <input type="password" name="password" id="password" placeholder="Password">
        </div>
        <button>Sign Up</button>
    </form>
</body>
...
```

## 7. Auth Demo: Registering

Now we need to figure out where the form will submit to. We will make a POST route called `/register`

```js
app.use(express.urlencoded({extended: true}));
...
app.post('/register', async (req, res) => {
    res.send(req.body);
});
```

And in our form, we will modify the action and include the POST method

```html
<form action="/register" method="POST">
...
</form>
```

Let's test this out by entering a username and password

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img14.jpg?raw=true)

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img15.jpg?raw=true)

Now we want to take that new user and password and store it in the DB. But remember that we have to hash the password first before storing it. Let's modify our POST route so that we hash our password

```js
app.post('/register', async (req, res) => {
    const {password, username} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    res.send(hashedPassword);
});
```

Let's try out logging in with the same username and password

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img16.jpg?raw=true)

Now let's modify our POST route so it saves our user

```js
app.post('/register', async (req, res) => {
    const {password, username} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hashedPassword
    });
    await user.save();
    res.redirect('/')
});
```

Now let's input the same username and password and see what we get in our DB

```
> db.users.find({})
{ "_id" : ObjectId("6009de8abe39be5b981c287c"), "username" : "brian", "password" : "$2b$12$3DXhIFPSKuzDSovoEP2dH.b0jHvq8VNYhlz0/o796jalkxT.bF8eS", "__v" : 0 }
```

## 8. Auth Demo: Login

Let's start by creating our new GET route to display the login page

```js
app.get('/login', (req, res) => {
    res.render('login')
});
```

Let's steal what we have in `register.ejs` and edit a few lines of code to make our form. This file will be called `login.ejs`

```html
...
<h1>Login</h1>
<form action="/login" method="POST">
    <div>
        <label for="username"></label>
        <input type="text" name="username" id="username" placeholder="Username">
    </div>
    <div>
        <label for="password"></label>
        <input type="password" name="password" id="password" placeholder="Password">
    </div>
    <button>Login</button>
</form>
```

Now we would have to make a POST route for submitting our login data. We will have it display `req.body` just to test if it works

```js
app.post('/login', (req, res) => {
    res.send(req.body);
});
```

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img17.jpg?raw=true)

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img18.jpg?raw=true)

Now the first step when the user sends their credentials is to find their username. We've been doing a lot of "find things by ID," but in this case with users and authentication, no one gives their ID. Their usernames should be unique. Now we have to compare the password in the `req.body` to the hashed method

```js
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if(validPassword) {
        res.send('WELCOME')
    }
    else {
        res.send('TRY AGAIN')
    }
});
```

Note that if the username is correct but the password is wrong, and vice-versa, never tell the user that one of them is incorrect. You don't want to give any hints

Let's try logging in with 'brian' and 'monkey' since we already have that stored in our DB, and then try it with invalid credentials

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img19.jpg?raw=true)

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img20.jpg?raw=true)

## 9. Auth Demo: Staying Logged In With Session

We will now implement a feature so that the user stays logged in or their session expires. The goal of this part is to keep track of a user's login status, and this is where sessions come in. The way we would do this is to store the ID of someone who is logged in inside of our sessions. Let's import _express-session_ into our app

```js
const session = require('express-session');
...
app.use(session({secret: 'notagoodsecret'}));
```

Now all we need to do is when you successfully log in, we're adding something to the session. The session involves a cookie that we will send back to the user. Since we imported _express-session_, we now have a cookie in our browser. We can now use that cookie for our authentication

```js
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if(validPassword) {
        // store the user's ID in the session
        req.session.user_id = user._id;
        res.send('WELCOME')
    }
    else {
        res.send('TRY AGAIN')
    }
});
```

We should also add that new line of code after a user registers

We have a `/secret` route, and we only want people who are logged in to see this route. To do this, we need to check if the `req.session.user_id` exists

```js
app.get('/secret', (req, res) => {
    if(!req.session.user_id) {
        res.redirect('/login')
    }
    res.send('THIS IS SECRET. YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN!');
});
```

Now when we log in successfully and go to this route, it will display correctly

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img21.jpg?raw=true)

The reason why we need to store the ID instead of saying using a boolean to tell whether a user is logged in or not is that sometings we need access to that ID. They can use their username or add in a new comment, etc.