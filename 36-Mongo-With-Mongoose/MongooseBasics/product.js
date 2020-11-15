const { triggerAsyncId } = require('async_hooks');
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
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String],
    quantity: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    }
})

const Product = mongoose.model('Product', productSchema);

const bike = new Product({name: 'Bike Helmet', price: 29.50, categories: ['Cycling', 'Safety', 123]});
bike.save()
    .then(data => {
        console.log('IT WORKED!!!');
        console.log(`DATA: ${data}`);
    })
    .catch(err => {
        console.log('OH NO, ERROR!!!!');
        console.log(err);
    })