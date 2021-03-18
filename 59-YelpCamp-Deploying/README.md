# Section 59 - YelpCamp: Deploying

## 1. Setting Up Mongo Atlas

### 1.1 Creating and Configuring Our Cluster

The next chunk of sections is about deploying our application, which takes some work. Things will be different when we go from local development to the real world. We'll start with our Mongo database. Our DB connection URL is local and we will need to to change it to another host and serve our DB. We will set up our production database, which will not be a local instance of Mongo. We will use *MongoDB Atlas*, a tool that allows us to use MongoDB as a service and store our data in the cloud. 

We will go through the register/login process and then create a free cluster to host our DB

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img1.jpg?raw=true)

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img2.jpg?raw=true)

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img3.jpg?raw=true)

The next thing we will do is create our first database user. This isn't something that we've used so far. Database users also exist on our local Mongo instance, but it's a capability of Mongo of different users with different permissions. There could be a problem where someone has unwanted access to our DB, so we will have to set up a user with a username and password

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img4.jpg?raw=true)

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img5.jpg?raw=true)

Be sure to copy the password because we will need it for later

The next thing we have to do, which is kinda annoying, is whitelisting our IP address, which is approving certain IP addresses that can access our cluster. We will go inside _Network Access_ to add IP addresses. We will then add our own IP address to it

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img6.jpg?raw=true)

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img7.jpg?raw=true)

Finally, we will connect to our cluster. We will do that by going under the _Clusters_ tab and clicking on the _CONNECT_ button

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img9.jpg?raw=true)

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img10.jpg?raw=true)

### 1.2 Changing Our Connection

We would need to copy the URL below and add it to our .env file. We would replace `<password>` with the actual password from our created user. Then in our `app.js`, we will replace the localhost URL with the one in our .env file

```js
const dbUrl = process.env.DB_URL;
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
```

Now when we go to our app, we don't see any campgrounds. That's good because everything is now hosted on our cloud DB. 

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img11.jpg?raw=true)

When we make new data or edit them for our DB, they will now show up in our cloud DB

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img12.jpg?raw=true)

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img13.jpg?raw=true)

For now, we'll use our local DB because we still haven't put this app into production 

## 2. Using Mongo For Our Session Store

### 2.1 connect-mongo

The next thing we'll do is configure our app to store session information using Mongo. We talked in the past that the default storage location for sessions is in memory. That can be problematic because it doesn't scale well. It's pretty easy to configure with a tool called `connect-mongo`

`npm i connect-mongo`

**Link to the docs**

- https://www.npmjs.com/package/connect-mongo

We will require it in our `app.js` and edit our session configuration so that it has `connect-mongo`

```js
const MongoStore = require('connect-mongo').default;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: 'thisshouldbeabettersecret!',
    touchAfter: 24 * 60 * 60
});

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
```

`touchAfter` refers to unnecessary saves or updates where the data in the session has not changed. So if the data has changed, then it will be saved and updated in our Mongo store; but if it was the same as it was, then it won't continuously update every time a user refreshes a page

### 2.2 Seeing Our Session Data

Now let's log into our app to see if our session is stored in our DB. We will do this with the query `db.sessions.find()`

```
> db.sessions.find().pretty()
{
        "_id" : "K9GlzDokiPO5bnrsNLuVCY4BKyvYtsiE",
        "expires" : ISODate("2021-03-25T00:00:29.607Z"),
        "lastModified" : ISODate("2021-03-18T00:00:29.607Z"),
        "session" : "{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2021-03-25T00:00:29.607Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":\"tim\"}}"
}
```

The information inside of this collect will not be stored forever. Each individual session by default lasts for only 14 days. This collection, obviously, can store more than 1 session. Let's log into this app from another browser so that we can see another session

```
> db.sessions.find().pretty()
{
        "_id" : "K9GlzDokiPO5bnrsNLuVCY4BKyvYtsiE",
        "expires" : ISODate("2021-03-25T00:00:29.607Z"),
        "lastModified" : ISODate("2021-03-18T00:00:29.607Z"),
        "session" : "{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2021-03-25T00:00:29.607Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":\"tim\"}}"
}
{
        "_id" : "vbcUN3bTNSfteI3agTm1OYhb8erZkLb1",
        "expires" : ISODate("2021-03-25T00:15:16.790Z"),
        "lastModified" : ISODate("2021-03-18T00:15:16.790Z"),
        "session" : "{\"cookie\":{\"originalMaxAge\":604800000,\"expires\":\"2021-03-25T00:15:16.790Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":\"brian\"}}"
}
```

## 3. Heroku Setup

Now we will work on deploying our app by using a tool called _Heroku_. This platform tends to be the friendliest for beginners to deploy things like Express apps. That doesn't mean it'll be completely friendly. There are things that you need to configure, change, install, etc. That's all the things that we'll have to do on another machine

The first thing is creating an Heroku account. There's no credit card required. The next step is installing the Heroku CLI. This allows us to use many command line Heroku tools, which are very important and are how we will get our code from our machine to Heroku.

**Link to Heroku CLI docs and download**

- https://devcenter.heroku.com/articles/heroku-cli

After we download the CLI, we need to log in with our Heroku account through the CLI with the `heroku login` command. We will focus on deploying our app in the next section

## 4. Pushing to Heroku

In our Heroku CLI, we will use a command called `heroku create` which hill make a new app for us on Heroku. Before you run that, make sure you are on the top level of your application

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img14.jpg?raw=true)

This command makes us a URL and we should see this app in our dashboard. When we go to that URL, we see this:

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img15.jpg?raw=true)

Now let's work on deploying our app. Let's go to our `app.js` and change what we did with our DB URL. Additionally, we will add a new `secret` variable 

```js
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp' ;

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
```

We will now push our code to git. Before, make sure you have a `.gitignore` file with `node_modules` and `.env` inside of it and commit all of our files. Use `git remote -v` to see the remote places that you are pushing your code to

```
$ git remote -v
heroku  https://git.heroku.com/infinite-ridge-76281.git (fetch)
heroku  https://git.heroku.com/infinite-ridge-76281.git (push)
```

Finally, run `git push heroku master` to push your code to your app. There is an error when the pushing is complete though. We will fix that in the next section

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/59-YelpCamp-Deploying/59-YelpCamp-Deploying/img-for-notes/img16.jpg?raw=true)