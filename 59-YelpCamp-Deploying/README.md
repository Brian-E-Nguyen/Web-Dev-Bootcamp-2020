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