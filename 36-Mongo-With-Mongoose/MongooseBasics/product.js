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
        min: [0, 'Price must be postive ya dofus!!']
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
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})

// productSchema.methods.greet = function() {
//     console.log('HELLOOOOOOOOOOOOOOOOOOO!');
//     console.log(`- from ${this.name}`)
// }

productSchema.methods.toggleOnSale = function() {
    this.onSale = !this.onSale;
    return this.save();
}

productSchema.methods.addCategory = function(newCategory) {
    this.categories.push(newCategory);
    return this.save;
}

productSchema.statics.fireSale = function() {
    return this.updateMany({}, {onSale: true, price: 0});
}

const Product = mongoose.model('Product', productSchema);

const findProduct = async () => {
    const foundProduct = await Product.findOne({name: 'Bike Helmet'});
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    // test out the changes
    console.log(foundProduct)
    await foundProduct.addCategory('Outdoors');
    // test out the changes
    console.log(foundProduct)
}

// findProduct();

Product.fireSale()
    .then(res => console.log(res));

// const bike = new Product({name: 'Cycling Jersey', price: 28.50, categories: ['Cycling'], size: 'XS'});
// bike.save()
//     .then(data => {
//         console.log('IT WORKED!!!');
//         console.log(`DATA: ${data}`);
//     })
//     .catch(err => {
//         console.log('OH NO, ERROR!!!!');
//         console.log(err);
//     })

// Product.findOneAndUpdate({name: 'Tire pump'}, {price: -10.99}, {new: true, runValidators: true})
//     .then(data => {
//         console.log('IT WORKED!!!');
//         console.log(`DATA: ${data}`);
//     })
//     .catch(err => {
//         console.log('OH NO, ERROR!!!!');
//         console.log(err);
//     })