const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, MONOG CONNECTION ERROR!!!!');
        console.log(error)
    });

// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// });

// p.save()
//     .then(p => {
//         console.log(`New data created: ${p}`)
//     })
//     .catch(error => {
//         console.log(error)
//     });

const seedProducts = [
    {
        name: 'Chocolate Whole Milk',
        price: 1.99,
        category: 'dairy'
    },
    {
        name: 'Organic Celery',
        price: 1.49,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Fairy Eggplant',
        price: 1.99,
        category: 'vegetable'
    },
    {
        name: 'Organic Seedless Watermelon',
        price: 3.49,
        category: 'fruit'
    },
    {
        name: 'Strawberry Whole Milk',
        price: 1.99,
        category: 'dairy'
    }
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });