# Section 40 - Middleware: The Key To Express

## 1. Intro to Express Middleware

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img1.jpg?raw=true)

Middleware is the building blocks of Express. They run when an request enters Express and stops when it sends a response

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/40-Middleware/40-Middleware/img-for-notes/img2.jpg?raw=true)

From the official docs 

***Middleware*** functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named `next`.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.