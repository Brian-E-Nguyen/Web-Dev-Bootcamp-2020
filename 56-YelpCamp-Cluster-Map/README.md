# Section 56 - YelpCamp: Fancy Cluster Map

## 1. Intro To Our Cluster Map

We will add a cool cluster map onto our index page for campgrounds. It'll look like this:

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img1.jpg?raw=true)

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

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img2.jpg?raw=true)

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

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img3.jpg?raw=true)


## 4. Basic Clustering Campgrounds

So now that we have our new data for our campgrounds, let's see how we can plug them into our map. When we go over to the `clusterMap.js` file, we see that there are a lot of `on()` functions. These reference different types of events. The code below, for example, is an event for hovering over a cluster on a map

```JS
map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
});
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img4.jpg?raw=true)

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

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img5.jpg?raw=true)

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

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img6.jpg?raw=true)

It did get our data, but it's unhappy with the way that it's formatted. If you look at the earthquake's data, everything is under the key of `features`; our's is just an array. We can have our data conform to that pattern by creating an object and setting `features` to that data; then we will pass that object into `clusterMap.js`

```html
<!-- campgrounds/index.ejs -->
<script>
    const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
    const campgrounds = {features: <%- JSON.stringify(campgrounds); %>}
</script>

<script src="/js/clusterMap.js"></script>
```

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img7.jpg?raw=true)

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

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img8.jpg?raw=true)

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/56-YelpCamp-Cluster-Map/56-YelpCamp-Cluster-Map/img-for-notes/img9.jpg?raw=true)

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