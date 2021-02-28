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

