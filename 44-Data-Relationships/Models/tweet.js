const mongoose = require('mongoose');
const { stringify } = require('querystring');
const {Schema} = mongoose;
mongoose.connect('mongodb://localhost:27017/relationshipDemo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log('CONNECTION OPEN!!!')
    })
    .catch(error => {
        console.log('OH NO, ERROR!!!!');
        console.log(error)
    });

const userSchema = new Schema({
    username: String,
    age: Number
});

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet', tweetSchema);

// const makeTweets = async () => {
//     // const user = new User({username: 'nairb322', age: 61});
//     const user = await User.findOne({username: 'nairb322'});
//     const tweet2 = new Tweet({text: 'REEEEEEEE', likes: 9999});
//     // storing the entire user
//     tweet2.user = user;
//     // user.save();
//     tweet2.save();
// }

// makeTweets();

const findTweet = async () => {
    const tweet = await Tweet.findOne({})
        .populate('user', 'username');
    console.log(tweet);
}

findTweet();