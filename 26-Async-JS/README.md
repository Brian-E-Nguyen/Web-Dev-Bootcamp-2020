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

http://latentflip.com/loupe/?code=ZnVuY3Rpb24gbXVsdGlwbHkoeCx5KSB7CiAgICByZXR1cm4geCAqIHk7Cn0KCmZ1bmN0aW9uIHNxdWFyZSh4KSB7CiAgICByZXR1cm4gbXVsdGlwbHkoeCx4KTsKfQoKZnVuY3Rpb24gaXNSaWdodFRyaWFuZ2xlKGEsYixjKXsKICAgIHJldHVybiBzcXVhcmUoYSkgKyBzcXVhcmUoYikgPT09IHNxdWFyZShjKTsKfQoKaXNSaWdodFRyaWFuZ2xlKDMsNCw1KQ%3D%3D!!!

Chrome-based browsers also has a debugger in the dev tools. Go to the "Sources" tab

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/26-Async-JS/26-Async-JS/img-for-notes/img2.jpg?raw=true)