# Section 56 - YelpCamp: Fancy Cluster Map

## 1. Intro To Our Cluster Map

We will add a cool cluster map onto our index page for campgrounds. It'll look like this:

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img1.jpg?raw=true)

Note that it may look intimidating, but we would just mostly reference code from Mapbox's documentation. There's no way that we can do this on our own

## 2. Adding Earthquake Cluster Map

**Link to the Mapbox Cluster documentation**

- https://docs.mapbox.com/mapbox-gl-js/example/cluster/

First, inside of our `campgrounds/index.ejs` file, let's make a `<div>` tag where we will place our cluster map

```html
<div id="map" style="width: 100%; height: 500px;">
    
</div>
```

Then let's copy all of the JS from that example in the link and put it inside of our new file `clusterMap.js` inside of our _public_ directory. We will then reference that file in our `campgrounds/index.ejs`

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img2.jpg?raw=true)

The copied JS code is using another Mapbox token. Let's use our own by referencing it inside of a `<script>` tag, just like how we did in our `campgrounds/show.ejs`

```html
<script>
    const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
</script>

<script src="/js/clusterMap.js"></script>
```

## 3. Reseeding Our Database (again)

We will reseed our DB so that the campgrounds are spread out across the US. If we take a look at our _seeds_ directory and see our `cities.js` file, each city already has a latitude and longitude associated with it. Using these, we can remove the hardcoded value of `[ -122.3301, 47.6038 ]` for our coordinates and replace them with these:

```js
geometry : { 
    type : "Point", 
    coordinates : [ 
        cities[random1000].longitude,
        cities[random1000].latitude,
    ]
}
```

Now the location of the campground should be the same as what is shown on it's show page map

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img3.jpg?raw=true)


## 4. Basic Clustering Campgrounds

So now that we have our new data for our campgrounds, let's see how we can plug them into our map. When we go over to the `clusterMap.js` file, we see that there are a lot of `on()` functions. These reference different types of events. The code below, for example, is an event for hovering over a cluster on a map

```JS
map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
});
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img4.jpg?raw=true)

Our map is loading its data from this piece of code

```js
map.on('load', function () {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('earthquakes', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

```

As you can see, it's loading data from a website link

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img5.jpg?raw=true)

Let's take one set of the data so that it's easier to see

```json
{
  "type": "Feature",
  "properties": {
    "id": "ak16994521",
    "mag": 2.3,
    "time": 1507425650893,
    "felt": null,
    "tsunami": 0
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -151.5129,
      63.1016,
      0
    ]
  }
}
```

What we need to do is pass in our own data inside `data`. On the `index.ejs` page, we will pass in `campgrounds` to `clusterMap.js`

```html
<!-- campgrounds/index.ejs -->
<script>
    const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
    const campgrounds = <%- JSON.stringify(campgrounds); %>
</script>

<script src="/js/clusterMap.js"></script>
```

Let's add our `campgrounds` object to our data. When we view the index page, we get this in our console

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img6.jpg?raw=true)

It did get our data, but it's unhappy with the way that it's formatted. If you look at the earthquake's data, everything is under the key of `features`; our's is just an array. We can have our data conform to that pattern by creating an object and setting `features` to that data; then we will pass that object into `clusterMap.js`

```html
<!-- campgrounds/index.ejs -->
<script>
    const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
    const campgrounds = {features: <%- JSON.stringify(campgrounds); %>}
</script>

<script src="/js/clusterMap.js"></script>
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img7.jpg?raw=true)

## 5. Tweaking Clustering Code

### 5.1 Data Sources

Let's return to `clusterMap.js` and see what's going on 

```js
map.on('load', function () {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('earthquakes', {
        type: 'geojson',
...
```

A string is passed into the `addSource()` function called `earthquakes`. This is a label or name for a source. The data is referred to by the keyword `source`, and we can have multiple sources in our map

```js
  map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
...
```

Let's change our source to `campgrounds` and replace all references of `earthqakes` withh `campgrounds` as our source

### 5.2 Going Through and Understanding the Code

Now we have options for customizing our circle

```js
'circle-color': [
    'step',
    ['get', 'point_count'],
    '#51bbd6',
    100,
    '#f1f075',
    750,
    '#f28cb1'
],
'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
]
```

This code below shows the amount of clusters in a circle and for the text that we see

```js
 map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
```

This code below is for a single unclustered point

```js
map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
```

Just by going through line-by-line in the code, we have a better understanding of how it works. Now we can play around with it and set up some tweaks

### 5.3 Making Some Tweaks

Our unclustered point is very small. Let's make it bigger my increasing its radius to 10 and its stroke width to 5

```js
map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#11b4da',
        'circle-radius': 10,
        'circle-stroke-width': 5,
        'circle-stroke-color': '#fff'
    }
});
```

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img9.jpg?raw=true)

For the code below, the `text-field` has `{point_count_abbreviated}`, which shows the count of campgrounds in a cluster. What we can do is interpolate to by adding in our own value

```js
map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': 'Num: {point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
```

You can play around with these on your own

## 6. Changing Cluster Size and Color

We have a small data set with our campgrounds, so let's increase its size. In our seeds file, let's change our loop from 50 to 300

```js
// seeds/index.js
 for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
```

One major problem that we have with this many campgrounds is that our campgrounds' index page will be overrun with campgrounds. Later on, we can use infinite scroll or pagination

Right now, we have different tiers of clusters

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img10.jpg?raw=true)

If we go to the code to find the color of the circle, we can see that the color of the circle is based on the `point_count`. The code comes with some helpful comments

```js
map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
        ]
    }
});
```

Let's take a look at the section for color. The next few code are really clunky so beware. The hex value and the number below it are 'grouped' together and represent each tier. For 100 and below, clusters will have the hex value of '#51bbd6', and so on. Above 750 is '#f28cb1'

```js
'circle-color': [
    'step',
    ['get', 'point_count'],
    '#51bbd6',
    100,
    '#f1f075',
    750,
    '#f28cb1'
],
```

Let's change our circles to these values


```js
'circle-color': [
    'step',
    ['get', 'point_count'],
    'red',
    10,
    'orange',
    30,
    'yellow'
],
```

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img11.jpg?raw=true)


Now we let's change the radius of each circle depending on how many campgrounds there are. The first number is pixel width and the next is the tier. This is saying anything below 100 campgrounds will be 20px wide

```js
'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    100,
    30,
    750,
    40
]
```

Let's change it so it matches with our circle colors above

```js
'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    10,
    30,
    30,
    40
]
```

![img12](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img12.jpg?raw=true)

Here's the final customization since Colt fiddled around with it some more

```js
style: 'mapbox://styles/mapbox/light-v10',
...
'circle-color': [
    'step',
    ['get', 'point_count'],
    '#00bcd4',
    10,
    '#2196f3',
    30,
    '#3f51b5'
],
'circle-radius': [
    'step',
    ['get', 'point_count'],
    15,
    20,
    25,
    30,
    40
]
```

![img13](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img13.jpg?raw=true)


## 7. Adding Custom Popups

### 7.1 Intro

The last thing we'll work on for this section is what happens when you click on a single point on the map. We're still seeing earthquake stuff, so let's fix that so we see a link to the campground or the title of it. Let's look at this part of the code in our `clusterMap.js`

```js
map.on('click', 'unclustered-point', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var mag = e.features[0].properties.mag;
    var tsunami;

    if (e.features[0].properties.tsunami === 1) {
        tsunami = 'yes';
    } else {
        tsunami = 'no';
    }
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
            'magnitude: ' + mag + '<br>Was there a tsunami?: ' + tsunami
        )
        .addTo(map);
});
```

This code is saying when you click on an unclusered point, run this function. We can see things like setting a tsunami or setting our own HTML message. Part of the code is earthquake-specific logic, which can be tricky because we want to is maybe take the title & ID to make a show-page. The way that they did it from the example we've copied was having this line of code

```js
// 'e' is an event object
var coordinates = e.features[0].geometry.coordinates.slice();
```

Let's run `console.log(e.features[0])` and take a look at what's inside

![img14](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img14.jpg?raw=true)

The event has a key called `properties`, but there's nothing inside of it. This brings us back to GeoJSON and how mapbox is expecting our data to be formatted. They expect your data to follow a pattern similar to the one show below

![img15](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img15.jpg?raw=true)

### 7.2 Adding Virtual Properties to Campgrounds

Our data does not have a `properties` field. All that we want is a pre-made description. To do this, we could make a virtual property in Mongoose and send it back. Let's go inside of our campground model and add a virtual property to it

```js
// models/campgrounds.js
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return 'I AM POPUP TEXT'
});
```

Then inside of our index page, if we wanted to access that virtual, we would add this:

```html
<div class="card-body">
    <h5 class="card-title"><%= campground.title %></h5>
    <!-- NEW PIECE OF CODE -->
    <h5 class="card-title"><%= campground.properties.popUpMarkup %></h5>
    <p class="card-text"><%= campground.description %></p>
    <p class="card-text">
        <small class="text-muted"><%= campground.location %> </small>
    </p>
    <a class="btn btn-primary" href="/campgrounds/<%=campground._id%>">View <%= campground.title %> </a>
</div>
```

And now we will see the text for each campground when we go on the index page

![img16](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img16.jpg?raw=true)

### 7.3 Including Virtuals to Mongoose

There's a problem. If we look at the `campgrounds` array, we don't have the `properties` field. 

![img17](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img17.jpg?raw=true)


This is because by default, Mongoose does not include virtuals when you convert a document to JSON. To do this, we would have to this code:

```js
// models/campgrounds.js
const opts = {toJSON: {virtuals: true}};
```

Then we will add that to the end of our campground schema

```js
// models/campgrounds.js

...

 reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts);
```

![img18](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img18.jpg?raw=true)


Now that we fixed this, let's click on a single campground. It will now show  `properties`. This is good because Mapbox automatically looks for a key called `properties`

![img19](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img19.jpg?raw=true)


### 7.4 Customizing Our Markup

Let's edit our code a bit so that we append the markup inside of the popup

```js
map.on('click', 'unclustered-point', function (e) {
    // NEW LINE OF CODE
    const text = e.features[0].properties.popUpMarkup;
    var coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // APPEND TEXT
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
            text
        )
        .addTo(map);
});
```

![img20](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img20.jpg?raw=true)

Now we can edit our virtual to include the information we want. Let's change it so that when we click on a campground, it shows us the link to its show-page

```js
// models/campgrounds.js
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    // 'this' referes to the campground object
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
});
```

![img21](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/56-YelpCamp-Cluster-Map/img-for-notes/img21.jpg?raw=true)