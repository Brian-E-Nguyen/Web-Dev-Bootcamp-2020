const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/relationshipDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    addresses: [
        {
            _id: {id: false},
            street: String,
            city: String,
            state: String,
            country: String,
        }
    ]
});

const User = mongoose.model('User', userSchema);

const makeUser = async () => {
    const user = new User({
        firstName: 'Harry',
        lastName: 'Potter'
    });
    user.addresses.push({
        street: '123 Sesame Street',
        city: 'New York',
        state: 'New York',
        country: 'USA'
    })
    const result = await user.save();
    console.log(result);
}

const addAddress = async(id) => {
    const user = await User.findById(id);
    user.addresses.push({
        street: '714 Elm Street',
        city: 'Calgary',
        state: 'Alberta',
        country: 'Canada'
    })
    const result = await user.save();
    console.log(result);
}

addAddress("5fd672aa57011b3e4014084b");
//makeUser();