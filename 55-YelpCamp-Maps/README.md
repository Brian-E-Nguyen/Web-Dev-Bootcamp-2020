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