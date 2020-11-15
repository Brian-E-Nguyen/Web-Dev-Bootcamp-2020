const mongoose = require('mongoose');
const { networkInterfaces } = require('os');
mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Mountain Bike', price: 599, color: 'red'})
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })