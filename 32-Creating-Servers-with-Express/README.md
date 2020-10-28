# Section 32: Creating Servers With Express

## 1. Intro to Express

Express is a "fast, unopinionated, minimalist web framework for Node.js". It helps us build web apps and get servers up and running. It's just an NPM package which comes with a bunch of methods and optional plugins that we can use to build web applications and API's.

A few lectures back, this slide was shown how we can make requests

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/32-Creating-Servers-with-Express/img-for-notes/img1.jpg?raw=true)

Express will help us with the piece on the right: the systems connecting to Google, which then connects to their database. We're listening to incoming requests, their `q`. Then, we build a response and send that back to the client.

Express helps us:

- Start up a server to listen for requests
- Parse incoming requests
    - turns text into objects, etc.
- Match those requests to particular routes
- Craft our http response and associated content
    - status code, headers, etc.


## 2. Libraries vs. Frameworks

When you use a **library,** you are in charge! You control the flow of the application code, and you decide when to use the library. 
- It's typically something that you can integrate into your code at any point
- Libraries like the ASCII art or text-color changer, you can put them anywhere you want

With **frameworks,** that control is inverted.  The framework is in charge, and you are merely a participant! The framework tells you where to plug in the code.
- You are writing the code how the framework tells you. You have to follow along their structure (name of files, what you put in those files)
- You're trading off your freedom for speed of development
