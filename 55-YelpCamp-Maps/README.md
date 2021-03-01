# Section 55 - YelpCamp: Adding Maps

The next big feature that we will add is maps. We will start small by displaying a map on the show page with pins that locate each camp. We will also discuss geocoding so a user doesn't have to enter in longitude and latitude coordinates

## 1. Registering For Mapbox

A tool that is really popular for developers is _Mapbox_

- https://www.mapbox.com/

First thing we do after we create an account is go to the tokens page where we will retrieve our public token, then we will add it to our .env file. Note that we don't hide this from the public because the client-side will use this 

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img1.jpg?raw=true)

```
MAPBOX_TOKEN=pk.eyJ1IjoiYnVyYWl5ZW4iLCJhIjoiY2tsbXBua2xtMGJmOTJzcXB0MnlmZHBtaiJ9.hNxy11aREESyZDOO6H9gHQ
```

## 2. Geocoding Our Locations

### 2.1 Introduction

So now we are working on the geocoding process when our form is submitted to make a new campground. When we specify a location by text, like Texas, Spain, a specific city, or even a specific address, we will take that text and attempt to get the latitude and longitude coordinates. The way we will do this is by using Mapbox's geocoding API. We install it by using this command

`npm install @mapbox/mapbox-sdk`

**Link to the docs.** Beware that it comes with a lot of features

- https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#geocoding

What we're after is the geocoding service in the docs, specifically, `forwardGeocode`. This function takes a query and the number of results that we want back. Here's an example of that function in action

```js
geocodingClient.forwardGeocode({
  query: 'Paris, France',
  limit: 2
})
  .send()
  .then(response => {
    const match = response.body;
  });
```

### 2.2 Modifying Our createCampground

Let's start inside of our `controllers/campgrounds.js` by importing what we need from Mapbox. The next thing is passing in our token into the geocoding function. We will use the key of `accessToken` and our value will be our token

```js
// controllers/campgrounds.js
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});
```

So all we need to do now is take our geocoder client we made and call `forwardGeocode` in our `createCampground` function

```JS
// campgrounds.js
module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: 'Yosemite, CA',
        limit: 1
    }).send();
    console.log(geoData);
    res.send('OK!!!!!!!!!!!!')
    // const campground = new Campground(req.body.campground);
    // campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    // campground.author = req.user._id;
    // await campground.save();
    // console.log(campground);
    // req.flash('success', 'Successfully made a new campground!')
    // res.redirect(`/campgrounds/${campground._id}`);
}
```

When we test this out, we get a lot in return, but we're more focused on the `geoData.body`, and inside of that, we are focused on the `features` field. 

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img2.jpg?raw=true)

More specifically inside of this, we want the `geometry` field because it gives us our coordinates. Printing `geoData.body.features[0].geometry.coordinates` will give us the longitude first, then latitude

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img3.jpg?raw=true)

Then what we need to do is use `req.body.campground.location` for our `query`

```js
// controllers/campgrounds.js
module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

...
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img4.jpg?raw=true)

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img6.jpg?raw=true)


## 3. Working With GeoJSON

### 3.1 Intro to GeoJSON

The next thing we will do is storing our information in our campground model. We could store the latitude and longitude in their own separate fields, but the way we will do this is different. What we're getting back from `geoData.body.features[0].geometry.coordinates` is a GeoJSON object

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img7.jpg?raw=true)

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img8.jpg?raw=true)

GeoJSON follows a particular format where we have `type` and `coordinate` fields, and we will store this entire thing. Here's what our `CampgroundSchema` will look like now:

```js
// models/campgrounds.js
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

...
```

Mongo has a lot of support for GeoJSON that you can do. We have to follow a pattern that involves storing certain stuff like "Point", so that's why we can't just only store latitude and longitude

### 3.2 Storing Our GeoJSON Data

When we create a campground, the way we will store that geometry is by attaching it to `req.body.camground` after we insert it into our new campground

```js
// controllers/campgrounds.js
module.exports.createCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}
```

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img9.jpg?raw=true)

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img10.jpg?raw=true)

We get a geometry of `{ type: 'Point', coordinates: [ -122.3301, 47.6038 ] }`. Let's insert the coordinates in maps to verify that we get Seattle, Washington

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img11.jpg?raw=true)

## 4. Displaying A Map

We will work on displaying a map for our campground, and then later we will have a pin that will point to the exact location. The portion of Mapbox that we'll be using is _Mapbox GL JS_, which is a tool to render interactive maps.

**Link to the docs**

- https://docs.mapbox.com/mapbox-gl-js/api/

 Let's grab the CDN's from the docs and put them in our boilerplate between our `<head>` tags

 ```html
<!-- boilerplate.ejs -->
<head>
    ...
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css' rel='stylesheet' />
</head>
 ```

 To display our map, we need to add the following code somewhere in our HTML file

```html
<div id='map' style='width: 400px; height: 300px;'></div>

<script>
mapboxgl.accessToken = '<your access token>';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
</script>
```

Let's put the `<div>` tag in our `show.ejs` file just right above the carousel. The next thing is to enable the actual map, because right now, it's not showing. Let's add a `<script>` tag at the bottom and add in the remainder of our code. Note, for our access token, we will import it from our .env file

```html
<script>
  mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>'
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
</script>
```

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img12.jpg?raw=true)

### 4.2 Moving Map Code Into Separate Script

We will move our JS code into a new file called `public/js/showPageMap.js`, and we will reference it with the `<script>` tag inside `show.ejs`. There's a problem: we won't be able to use the EJS access token inside the JavaScript file because EJS takes the template goes through all EJS syntax in our `show.ejs`, then spits out regular HTML. It doesn't go through the script at the bottom of an EJS file because it doesn't think there's any EJS syntax and leaves it alone. What we need to do is get the access token from an EJS file to our JS file

At the very top of our `show.ejs` file, we will put a `<script>` tag that has our Mapbox token

```html
<!-- show.ejs -->
<script>
  const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
</script>
```

And now we can reference the `mapToken` variable in our `showPageMap.js` file

```js
// showPageMap.js
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
});
```

And everything will work fine

## 5. Centering The Map On A Campground

### 5.1 Marker On Location

Let's talk about how we can add a marker on the map. Here's an example on the docs

```html
<script>
	mapboxgl.accessToken = 'pk.eyJ1IjoiYnVyYWl5ZW4iLCJhIjoiY2tsbXBua2xtMGJmOTJzcXB0MnlmZHBtaiJ9.hNxy11aREESyZDOO6H9gHQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [12.550343, 55.665957],
        zoom: 8
    });
 
    var marker = new mapboxgl.Marker()
        .setLngLat([12.550343, 55.665957])
        .addTo(map);
</script>
```

We create a new marker using `Marker()`, then we use the `setLngLat()` to specify the longitude and latitude of our location, and lastly, `addToMap(map)`. Let's do that on our `showPageMap.js`

```js
// showPageMap.js
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 4 // starting zoom
});

new mapboxgl.Marker()
  .setLngLat([-74.5, 40])
  .addTo(map);
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img13.jpg?raw=true)

The docs specify how you can customize your marker. The default is set to this light blue

### 5.2 Centering the Location

Let's get this map centered on the actual location and put a marker on it. What we need to do is the same process like we did with a map token, where we use EJS to create a JS variable that we have access to in a JS file. In our `<script>` tag inside of our `show.ejs` file, we will create a campground variable so that we have access to it on the client-side

```html
<!-- show.ejs -->
<script>
  const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
  const campground = <%- campground %>;
</script>
```

There's a problem with this though. This is what we get when we look in the console

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img14.jpg?raw=true)

The value of the ID needs to be in quotes, so we need to stringify the JSON object

```html
<!-- show.ejs -->
<script>
  const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
  const campground = <%- JSON.stringify(campground) %>;
</script>
```

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img15.jpg?raw=true)

So now we have access to the campground object, let's use it in our `showPageMap.js` to use the coordinates for our `center` field

```js
// showPageMap.js
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .addTo(map);
```

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/55-YelpCamp-Maps/55-YelpCamp-Maps/img-for-notes/img16.jpg?raw=true)

A problem that might happen is that a user might enter a location that doesn't exist. We're not handling that at all, but we're only just introducing you to displaying a campground. It's up to you how you would handle it

## 6. Fixing Our Seeds Bug

One issue that we've ran into is that when seeding new campgrounds, we weren't uploading any images. We will put this in our `index.ejs` to check if there are any images in the campground. If not, we will have a default

```html
<% if (campground.images.length) { %>
<img class="img-fluid" alt="" src="<%=campground.images[0].url%>">
<% } else { %>
<img class="img-fluid" alt="" src="https://images.unsplash.com/photo-1465800872432-a98681fc5828?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1792&q=80">
<% } %> 
```

We could have a backup image inside of our model also, because the show pages don't have an image. Also, our old campgrounds don't have longitude and latitude, and if we were to delete a photo from them, then things will break. These little problems always come up when creating an app.

In our `seeds/index.js` file, let's hardcode a value for `geometry`

```js
// seeds/index.js
const camp = new Campground({
            author: '6014644ae18c19056071bdb6',
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?",
            price: price,
            geometry : { 
                type : "Point", 
                coordinates : [ -122.3301, 47.6038 ]
            },
...
```

The geometry we put in here points to Seattle, Washington