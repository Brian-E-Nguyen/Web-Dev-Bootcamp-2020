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

## 3. Intro to NPM

**Node Package Manager (NPM)** is literally two things:

1. A library of thousands of packages published by other developers that we can use for free
2. A command-line tool to easily install and manage those packages in our Node projects

NPM is already included with Node.js. Just type in `npm` on your terminal

```
$ npm

Usage: npm <command>

where <command> is one of:
    access, adduser, audit, bin, bugs, c, cache, ci, cit,
    clean-install, clean-install-test, completion, config,
    create, ddp, dedupe, deprecate, dist-tag, docs, doctor,
    edit, explore, fund, get, help, help-search, hook, i, init,
    install, install-ci-test, install-test, it, link, list, ln,
    login, logout, ls, org, outdated, owner, pack, ping, prefix,
    profile, prune, publish, rb, rebuild, repo, restart, root,
    run, run-script, s, se, search, set, shrinkwrap, star,
    stars, start, stop, t, team, test, token, tst, un,
    uninstall, unpublish, unstar, up, update, v, version, view,
    whoami

npm <command> -h  quick help on <command>
npm -l            display full usage info
npm help <term>   search for help on <term>
npm help npm      involved overview
```

[Link to NPM's website](https://www.npmjs.com/)

## 4. Installing Packages

### 4.1 Installation

To install packages from NPM, use `npm install <package name>` or  `npm i <package name>`. The package name comes from the package's page on the NPM site. Note that we have to copy the name exactly.

For our example, we'll use a package called `give-me-a-joke`. We will now create a new directory called "Jokesters", go into that directory and run `npm install give-me-a-joke`.

However, if we run this, we get this warning message:

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/31-Modules-and-NPM/img-for-notes/img1.jpg?raw=true)

We'll address this in the next video.

### 4.2 Generated Files and Directories

When we imported this module, we get a new folder called "node_modules".

```
$ ls
node_modules  package-lock.json
```

Every single thing inside the "node_modules" folder is a dependency for `give-me-a-joke`. Don't ever touch this folder

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/31-Modules-and-NPM/img-for-notes/img2.jpg?raw=true)

We are also given a file called `package-lock.json`. This is a record of the "node_modules" directory. Don't touch that either

```json
{
  "requires": true,
  "lockfileVersion": 1,
  "dependencies": {
    "accepts": {
      "version": "1.3.7",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.7.tgz",
      "integrity": "sha512-Il80Qs2WjYlJIBNzNkK6KYqlVMTbZLXgHx2oT0pU/fjRHyEp+PEfEPY0R3WCwAGVOtauxh1hOxNgIf5bv7dQpA==",
      "requires": {
        "mime-types": "~2.1.24",
        "negotiator": "0.6.2"
      }
    },
    "ajv": {
      "version": "6.12.6",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.12.6.tgz",
      "integrity": "sha512-j3fVLgvTo527anyYyJOGTYJbG+vnnQYvE0m5mmkc1TK+nxAppkCLMIL0aZ4dblVCNoGShhm+kzE4ZUykBoMg4g==",
      "requires": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      }
    },
    ...
```

### 4.3 Working With the Module

[Link to give-me-a-joke](https://www.npmjs.com/package/give-me-a-joke)

Let's create an `index.js` file inside of the "Jokester" directory. To import the module, we would have to require it by name. In this case, it should look like this:

```js
const jokes = require('give-me-a-joke');
// To test if we imported the module correctly
console.dir(jokes);
```

```
$ node index.js
{
  getRandomCNJoke: [Function],
  getCustomJoke: [Function],
  getRandomDadJoke: [Function],
  getRandomJokeOfTheDay: [Function]
}
```

Now we can see that we have access to everything related to `give-me-a-joke`. Let's use `getRandomDadJoke`

```js
const jokes = require('give-me-a-joke');

// To get a random dad joke
jokes.getRandomDadJoke (function(joke) {
    console.log(joke)
});
```

```
$ node index.js
I went to the store to pick up eight cans of sprite... when I got home I realized I'd only picked seven up
```

## 5. Adding Global Packages

If we want to install packages globally, we would use `npm install -g <package name>`

## 6. Package.json

### 6.1 Basic Info

The `package.json` file contains metadata or information about a particular project, package, or application. There are things like the description, license, name, version, etc. The stuff that we care about the most are the dependencies

 Here's what the `package.json` file looks like for `give-me-a-joke`

```json
{
  "_from": "give-me-a-joke",
  "_id": "give-me-a-joke@0.3.2",
  "_inBundle": false,
  "_integrity": "sha512-crqm+UGdXSsZPiYJz1SpkHIl/LPd95UCCkku6UcJzeu73MCGZ1ND+tmv/hfRadHQpi8cupg5hI+LrKH6XD0QCQ==",
  "_location": "/give-me-a-joke",
  "_phantomChildren": {},
  "_requested": {
    "type": "tag",
    "registry": true,
    "raw": "give-me-a-joke",
    "name": "give-me-a-joke",
    "escapedName": "give-me-a-joke",
    "rawSpec": "",
    "saveSpec": null,
    "fetchSpec": "latest"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/give-me-a-joke/-/give-me-a-joke-0.3.2.tgz",
  "_shasum": "75f256375e30cab7a8a182f2191d51293cf3e93e",
  "_spec": "give-me-a-joke",
  "_where": "C:\\Users\\BRIAN\\Desktop\\Web-Dev-Bootcamp-2020\\31-Modules-and-NPM\\Jokester",
  "author": {
    "name": "Saurabh Shubham"
  },
  "bugs": {
    "url": "https://github.com/Saurabh3333/give-me-a-joke/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "request": "^2.88.2"
  },
  "deprecated": false,
  "description": "A npm-module for random and customized jokes.",
  "homepage": "https://github.com/Saurabh3333/give-me-a-joke#readme",
  "keywords": [
    "give-me-a-joke",
    "chuck",
    "norris",
    "jokes",
    "npm",
    "jokes",
    "dad",
    "joke",
    "santa",
    "banta",
    "jokes",
    "random",
    "funny",
    "cn-jokes",
    "filler-jokes",
    "jokes-filler"
  ],
  "license": "MIT",
  "main": "index.js",
  "name": "give-me-a-joke",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Saurabh3333/give-me-a-joke.git"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "version": "0.3.2"
}

```

### 6.2 Creating Our Own Package (`npm init`)

To create our own package, we would run `npm init`

```
$ npm init

Press ^C at any time to quit.
package name: (artster)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author: Brian
license: (ISC)
About to write to C:\Users\BRIAN\Desktop\Web-Dev-Bootcamp-2020\31-Modules-and-NPM\Artster\package.json:

{
  "name": "artster",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Brian",
  "license": "ISC"
}


Is this OK? (yes)
```

This will then create a `package.json` file in our directory.

Now we will install another package. If you remember before, we saw an error in the command line. It was more of a warning, but it stated that it couldn't find the `package.json`. But now that we have it

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/31-Modules-and-NPM/img-for-notes/img3.jpg?raw=true)

...and when we look in the `package.json` file, it now has `figlet` as a dependency

```json
{
  "name": "artster",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Brian",
  "license": "ISC",
  "dependencies": {
    "figlet": "^1.5.0"
  }
}

```