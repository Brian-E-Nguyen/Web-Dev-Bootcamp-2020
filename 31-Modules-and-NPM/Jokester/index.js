const jokes = require('give-me-a-joke');
const colors = require('colors');
// // To test if we imported the module correctly
// console.dir(jokes);

// To get a random dad joke
jokes.getRandomDadJoke (function(joke) {
    console.log(joke.brightCyan.bgWhite.underline)
});