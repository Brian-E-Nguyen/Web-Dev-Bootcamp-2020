# Section 31: Exploring Modules & The NPM Universe

## 1. Working With module.exports

Say we have a `math.js` file with this content:

```js
// math.js
const add = (x, y) => x + y;

const PI = 3.14159;

const square = x => x * x;
```

If we were to import this math module and print it out on the console, we would only get an empty object

```js
const math = require('./math');
console.log(math);

// Output: {}
```

We need to explicitly state what we want to export out of this file. There's a special property called `module.exports` and by default it is an object. If we set it to a value, let's say a string, it will output that string

```js
// math.js
const add = (x, y) => x + y;

const PI = 3.14159;

const square = x => x * x;

module.exports = 'HELLO!!!!!!'
```

```
$ node app.js
HELLO!!!!!!
```

It doesn't matter what is in the rest of the file. The only thing it's gonna export is the string. If we wanted to add our contents to the export, we could do something like this:

```js
// math.js
const add = (x, y) => x + y;

const PI = 3.14159;

const square = x => x * x;

module.exports.add = add;
module.exports.PI = PI;
module.exports.square = square;
```

So now, the object will look like this:

```
$ node app.js
{ add: [Function: add], PI: 3.14159, square: [Function: square] }
```

We can now use these objects in our code. Some examples:

```js
const {PI, square} = require('./math')
console.log(PI);
console.log(square(9))
```

```
$ node app.js
3.14159
81
```

Another way we could export is creating our own `math` object with the stuff that we want to export

```js
const add = (x, y) => x + y;

const PI = 3.14159;

const square = x => x * x;

const math = {
    add: add,
    PI: PI,
    square: square
}

module.exports = math;
```

Or you can use `module.exports` when defining functions / variables

```js
module.exports.add = (x, y) => x + y;

module.exports.PI = 3.14159;

module.exports.square = x => x * x;
```

There is a shorter way to using `module.exports`. It's just by using `exports`

```js
const add = (x, y) => x + y;

const PI = 3.14159;

const square = x => x * x;

exports.square = square;
exports.PI = PI;
```

## 2. Requiring a Directory

Let's say we have a directory called 'shelter' with cat files in them. One of them, for example, looks like this:

```js
// blue.js
module.exports = {
    name: 'blue',
    color: 'grey'
}
```

And then, we have a file, `index.js` that looks like this:

```js
// index.js
const blue = require('./blue');
const sadie = require('./sadie');
const janet = require('./janet');

const allCats = [blue, sadie, janet];
console.log(allCats)
```

Here's what it would look like when we run this file:

```
$ node index.js
[
  { name: 'blue', color: 'grey' },
  { name: 'sadie', color: 'white' },
  { name: 'janet', color: 'orange' }
]
```

If we wanted to require an entire directory, **node is going to look for the `index.js` file** and whatever file exports is what the directory will export. Now, we'll change our `index.js` file so that it can export `allCats`

```js
// index.js
const blue = require('./blue');
const sadie = require('./sadie');
const janet = require('./janet');

const allCats = [blue, sadie, janet];
module.exports = allCats;
```

Outside of our directory, we'll make changes to the `app.js`

```js
const cats = require('./shelter');
console.log('REQUIRED AN ENTIRE DIRECTORY!', cats)
```

```
$ node app.js
REQUIRED AN ENTIRE DIRECTORY! [
  { name: 'blue', color: 'grey' },
  { name: 'sadie', color: 'white' },
  { name: 'janet', color: 'orange' }
]
```