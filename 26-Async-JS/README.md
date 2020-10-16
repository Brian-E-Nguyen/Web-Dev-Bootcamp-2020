# Section 26: Async JavaScript. Oh boy!

## 1. The Call Stack

The Call Stack is the mechanism that the JS interpreter uses to keep track of its place in a script that calls multiple functions.

How JS "knows" what function is currently being run and what functions are called from within that function, etc.

It's like a finger in a book. Your finger is keeping track of where you are reading, or like a page number or a book mark. 

This uses the stack data structure, where it has the LIFO rule.

### 1.1 How it Works

- when a script calls a function, the interpreter adds it to the call stack and then starts carrying out the function
- any functions that are called by that function are added to the call stack further up, and run where their calls are reached
- when the current function is finished, the interpreter takes it off the stack and resumes where it left off in the last code listing

```js
const multiply = (x, y) => x * y;

const square = x => multiply(x, x);

const isRightTriangle = (a, b, c) => (
    square(a) + square(b) === square(c)
)

isRightTriangle(3, 4, 5)

// isRightTriangle(3, 4, 5)
// square(3) + square(4) === square(5)

// square(3)
// multiply(3, 3)
// 9
```

`isRightTriangle` calls `square`, which then calls `multiply`

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img1.jpg?raw=true)

From the `multiply` function, the 9 is then passed into `square`, which then passes into `isRightTriangle`

```js
9 + square(4) === square(5)
```

### 1.2 Visualizing the Call Stack

[Link to example](http://latentflip.com/loupe/?code=ZnVuY3Rpb24gbXVsdGlwbHkoeCx5KSB7CiAgICByZXR1cm4geCAqIHk7Cn0KCmZ1bmN0aW9uIHNxdWFyZSh4KSB7CiAgICByZXR1cm4gbXVsdGlwbHkoeCx4KTsKfQoKZnVuY3Rpb24gaXNSaWdodFRyaWFuZ2xlKGEsYixjKXsKICAgIHJldHVybiBzcXVhcmUoYSkgKyBzcXVhcmUoYikgPT09IHNxdWFyZShjKTsKfQoKaXNSaWdodFRyaWFuZ2xlKDMsNCw1KQ%3D%3D!!!)

Chrome-based browsers also has a debugger in the dev tools. Go to the "Sources" tab

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img2.jpg?raw=true)


## 2. WebAPI's and Single Threaded

### 2.1 Single Threads

JavaScript is single threaded. What this means is that at any given point in time, that single JS thread is running at most one line of JS code at a time. It seems that it can be problematic. It could take longer to make requests for data or to create and save data. 

Even though JS can only do one thing at a time, there are many workarounds

```js
console.log('I print first!');
setTimeout(() => {
    console.log('I print after 3 seconds!');
}, 3000);
console.log('I print second!')
```
### 2.2 Web API's

Why didn't the `setTimeout` function execute second? It's because of the _browser_ doing the work, not JS. The browser itself is not written in JS. It's written in other languages, like C++. `setTimeout` is a Web API function

Ok, but how does it work?

- browsers come with Web API's that are able to handle certain tasks in the background (like making requests or setTimeout)
- the JS call stack recognizes these Web API functiosn and passes them off to the browser to take care of. It's like JS is telling the browser "remind me in 3 seconds to finish this."
- once the browser finishes those tasks, they return and are pushed onto the stack as a callback

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img3.jpg?raw=true)

JS executes the third line of code while the browser waits for 3 seconds

### 2.3 Stack Example

[Link to example](http://latentflip.com/loupe/?code=Y29uc29sZS5sb2coIlNlbmRpbmcgcmVxdWVzdCB0byBzZXJ2ZXIhIikKc2V0VGltZW91dChmdW5jdGlvbigpIHsKICAgIGNvbnNvbGUubG9nKCJIZXJlIGlzIHlvdXIgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuLi4iKQp9LCAzMDAwKQpjb25zb2xlLmxvZygiSSBBTSBBVCBUSEUgRU5EIE9GIFRIRSBGSUxFISIp!!!)

## 3. Callback Helll :(

Let's say that we want to constantly change our page's background color every second. One way to do this is like this:

```js
setTimeout(() => {
    document.body.style.backgroundColor = 'red'
}, 1000)

setTimeout(() => {
    document.body.style.backgroundColor = 'orange'
}, 2000)
```

But as you can see, it looks janky and inefficient. And if we wanted more colors, then we would have to copy more of this code and hardcode the time.

A slightly more efficient way to do this is to nest the `setTimeout` functions in each other

```js
setTimeout(() => {
    document.body.style.backgroundColor = 'red';
    setTimeout(() => {
        document.body.style.backgroundColor = 'orange'
    }, 1000)
}, 1000)
```
But as you can see, everything looks ridiculous

```js
setTimeout(() => {
    document.body.style.backgroundColor = 'red';
    setTimeout(() => {
        document.body.style.backgroundColor = 'orange';
        setTimeout(() => {
            document.body.style.backgroundColor = 'yellow';
            setTimeout(() => {
                document.body.style.backgroundColor = 'green';
                setTimeout(() => {
                    document.body.style.backgroundColor = 'blue';
                    setTimeout(() => {
                        document.body.style.backgroundColor = 'purple';
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}, 1000)
```

Another example:

```js
searchMoviesAPI('amedeus', () => {
    saveToMyDB(movie, () => {
        // if it works, run this
    }, () => {
        // if not, then run this
    })
})
```

As you can see, nesting is really bad because more than one callback can pass into each function.

Fortunately there are new additions that will solve this problem

## 4. Demo: fakeRequest Using Callbacks

```js
const fakeRequestCallback = (url, success, failure) => {
    const delay = Math.floor(Math.random() * 4500) + 500;
    setTimeout(() => {
        if (delay > 4000) {
            failure('Connection Timeout :(')
        } else {
            success(`Here is your fake data from ${url}`)
        }
    }, delay)
}
```

For this function, we pass in a URL and two callbacks: success and failure. If we want to make multiple requests, we can (but shouldn't) do nesting

```js
fakeRequestCallback('books.com/page1',
    function (response) {
        console.log("IT WORKED!!!!")
        console.log(response)
        fakeRequestCallback('books.com/page2',
            function (response) {
                console.log("IT WORKED AGAIN!!!!")
                console.log(response)
                fakeRequestCallback('books.com/page3',
                    function (response) {
                        console.log("IT WORKED AGAIN (3rd req)!!!!")
                        console.log(response)
                    },
                    function (err) {
                        console.log("ERROR (3rd req)!!!", err)
                    })
            },
            function (err) {
                console.log("ERROR (2nd req)!!!", err)
            })
    }, function (err) {
        console.log("ERROR!!!", err)
    })
```

## 5. Demo: fakeRequest Using Promises

A **promise** is an object representing the eventual completion or failure of an asynchronous operation. A common operation is getting data from other API's. Things that can make it fail are bad URL's, the internet's down, whatever. It's like a promise in the real world. It's the eventual guarantee of receiving a value

```js
const fakeRequestPromise = (url) => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (4500)) + 500;
        setTimeout(() => {
            if (delay > 4000) {
                reject('Connection Timeout :(')
            } else {
                resolve(`Here is your fake data from ${url}`)
            }
        }, delay)
    })
}
```

When we execute the `fakeRequestPromise` with any URL, the return value is a *Promise*

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img4.jpg?raw=true)

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img6.jpg?raw=true)

You can attach callbacks or methods to promises that will run depending if a promise is successful or it failed

```js
const request = fakeRequestPromise('yelp.com/api/coffee');
request.then(() => {
    console.log('PROMISE RESOLVED')
    console.log('IT WORKED')
}).catch(() => {
    console.log('PROMISE REJECTED')
    console.log('OH NO, ERROR!!!')
})
```

You don't need to save it to a variable. You can chain it.

```js
fakeRequestPromise('yelp.com/api/coffee')
    .then(() => {
        console.log('PROMISE RESOLVED')
        console.log('IT WORKED')
    })
    .catch(() => {
        console.log('PROMISE REJECTED')
        console.log('OH NO, ERROR!!!')
})
```

## 6. The Magic of Promises

We can clean up the multiple nested `fakeRequestCallback` function with this:

```js
fakeRequestPromise('yelp.com/api/coffee/page1')
    .then((data) => {
        console.log("IT WORKED!!!!!! (page1)")
        console.log(data)
        return fakeRequestPromise('yelp.com/api/coffee/page2')
    })
    .then((data) => {
        console.log("IT WORKED!!!!!! (page2)")
        console.log(data)
        return fakeRequestPromise('yelp.com/api/coffee/page3')
    })
    .then((data) => {
        console.log("IT WORKED!!!!!! (page3)")
        console.log(data)
    })
    .catch((err) => {
        console.log("OH NO, A REQUEST FAILED!!!")
        console.log(err)
    })
```

The callbacks go down line by line. If at any point the request failed, then it will go to the catch block

## 7. Creating Our Own Promises

When creating promises, we always pass in two parameters: `resolve` and `reject`

```js
new Promise((resolve, reject) => {
    
})
```

If we were to put this in the console, it would say that the status is "Pending." If we were to put a function inside of the promise called `resolve()` or `reject()`, then it would say that the status is resolved or rejected respectively

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img7.jpg?raw=true)

Here is an example for making a request with our custom made Promise

```js
const fakeRequest = (url) => {
    return new Promise((resolve, reject) => {
        const rand = Math.random();
        setTimeout(() => {
            if (rand < 0.7) {
                resolve('YOUR FAKE DATA HERE');
            }
            reject('Request Error!');
        }, 1000)
    })
}

fakeRequest('/dogs/1')
    .then((data) => {
        console.log("DONE WITH REQUEST!")
        console.log('data is:', data)
    })
    .catch((err) => {
        console.log("OH NO!", err)
    })
```

Here is an example with changing the body colors

```js
const delayedColorChange = (color, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = color;
            resolve();
        }, delay)
    })
}

delayedColorChange('red', 1000)
    .then(() => delayedColorChange('orange', 1000))
    .then(() => delayedColorChange('yellow', 1000))
    .then(() => delayedColorChange('green', 1000))
    .then(() => delayedColorChange('blue', 1000))
    .then(() => delayedColorChange('indigo', 1000))
    .then(() => delayedColorChange('violet', 1000))
```

In this case, we don't use `reject` because there's nothing to reject

## 8. Async Keyword

Async functions help us write cleaner asynchronous code

- async functions always return a promise
- if the function returns a value, the promise will be resolved with that value
- if the function throws an exception, the promise will be rejected

```js
async function hello() {
    return 'Hey guy!';
}
hello(); // Promise {<resolved>: "Hey guy!"}

async function uhOh() {
    throw new Error('oh no!');
}
uhOh(); // {<rejected>: Error: oh no!}
```

If we were to make an async function with nothing in it, for example, then it will return a promise

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img8.jpg?raw=true)

We can also use arrow functions.

```js
const sing = async () => {
    throw "OH NO, PROBLEM!"
    return 'LA LA LA LA'
}

sing()
    .then(data => {
        console.log("PROMISE RESOLVED WITH:", data)
    })
    .catch(err => {
        console.log("OH NO, PROMISE REJECTED!")
        console.log(err)
    })
```

The way we reject a promise is by throwing an error inside of the async function

```js
const login = async (username, password) => {
    if (!username || !password) throw 'Missing Credentials'
    if (password === 'corgifeetarecute') return 'WELCOME!'
    throw 'Invalid Password'
}

login('todd', 'corgifeetarecute')
    .then(msg => {
        console.log("LOGGED IN!")
        console.log(msg)
    })
    .catch(err => {
        console.log("ERROR!")
        console.log(err)
    })
```