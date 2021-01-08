# Section 48: Express Session & Flash

These will be quick sections focused on "sessions", which will allow us to implement authentication keep people logged in, remember their information, etc. It also goes along with cookies. Then we will talk about how to set up Express Sessions. Lastly, we will integrate Flash messages, which are little popup messages that are sent to the user

## 1. Introduction to Sessions

It's not very practical (or secure) to store a lot of datta client-side using cookies. This is where sessions come in!

**Sessions** are a *server-side* data store that we use to make HTTP stateful. Instead of storing data using cookies, we store the data on the *server-side* and then send the browser a cookie that can be used to retrieve the data. The idea is not to store the data permanently, but rather to persist something from one request to the next to keep track of who's logged in, what's in the person's shopping cart, what's their username, etc.

So why not just use cookies? One thing is that cookies have a maximum size in your browser. Most browsers have a limit on how many cookies are stored are how big the cookie size is. Another thing is that they're not as secured when they are stored

The idea of a session is that we store information on the server-side and then we send a little cookie back to the client that says "here's the key and ID to unlock your session"

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img1.jpg?raw=true)

Here's a diagram to understand how sessions work. *Data store* is not the same as a database. In it, we will store shopping cart info for various users currently on our site, even if they don't have an account or not logged in. So instead of storing shopping cart information that is associated with a user inside of a database, we will have a session with an ID that will be associated with shopping cart information. 

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/48-Express-Session-and-Flash/48-Express-Session-and-Flash/img-for-notes/img2.jpg?raw=true)

The browser then uses that information on subsequent requests