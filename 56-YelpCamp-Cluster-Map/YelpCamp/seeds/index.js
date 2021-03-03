const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const {places, descriptors} = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// Returns a random element from the array
const sample = array => array[Math.floor(Math.random() * array.length)];

/* 
NOTE: 'image' field must be changed to 'images'. I did not do that
so that I don't reveal my Cloudinary username
*/
const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6014644ae18c19056071bdb6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio ducimus omnis quo dicta nisi. Atque minus asperiores a tempora harum blanditiis, vitae commodi delectus. Assumenda delectus quibusdam sequi corrupti?",
            price: price,
            geometry : { 
                type : "Point", 
                coordinates : [ 
                    cities[random1000].longitude,
                    cities[random1000].latitude,
             ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/buraiyen/image/upload/v1614627997/YelpCamp/qwblggvlo82olilpgzuz.jpg',
                    filename: 'YelpCamp/zulgzsymaebibohc6vnj'
                },
                {
                    url: 'https://res.cloudinary.com/buraiyen/image/upload/v1613939383/YelpCamp/gk8zkxmggp2oklbqqrel.jpg',
                    filename: 'YelpCamp/gk8zkxmggp2oklbqqrel'
                }
            ]
        });
        await camp.save();
    }
}

seedDB();