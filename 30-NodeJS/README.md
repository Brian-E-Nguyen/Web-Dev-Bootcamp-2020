# 30. Node JS

## 1. Intro to Node JS

Until recently, we could only run JavaScript code in a web browser.   Node is a JavaScript runtime that executes code **outside of the browser.** We can use the same JavaScript syntax we know and love to write **server-side code,** instead of relying on other languages like Python or Ruby.

## 2. What is Node Used For?

- Web Servers
    - AJAX & API's
    - Making your own API's
- Command Line Tools
    - applications that run on your command line that doesn't have a traditional UI, like NPM
- Native Apps (VSCode is a Node app!)
- Video Games
- Drone Software
- A Whole Lot More!

## 3. The Node REPL

To access the Node REPL in your terminal (assuming it's already downloaded), type in `node`.

Some basic commands are `.help`, `.exit`, `.save`, etc.

You can do basic JS inside of the Node REPL

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/30-NodeJS/img-for-notes/img1.jpg)

However, there are things that we don't have in Node JS. We don't have DOM API's, window, or the document. Instead of the window, we have an object called `global`

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/30-NodeJS/img-for-notes/img2.jpg)

We don't have functions that exist in browsers when we use Node JS, but what we do have is a bunch of modules that help us interact with files, folders, and the OS

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/30-NodeJS/img-for-notes/img3.jpg)

[Link to slides](https://www.canva.com/design/DAEEJ5vmCOs/-MdF0FsNq0tKab3baCY6eg/view?utm_content=DAEEJ5vmCOs&utm_campaign=designshare&utm_medium=link&utm_source=sharebutton#4)

## 4. Running Node Files

To run files with Node JS, type in `node <filename>` in the terminal

```js
// firstScript.js code
for (let i = 0; i < 10; i++) {
    console.log('HELLO');
}
```

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/30-NodeJS/img-for-notes/img4.jpg)

Make sure you are referencing the file relative to where you are at. You can't just type in the file name and always expect it to work