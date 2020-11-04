# 34. Defining RESTful Routes

## 1. GET vs. POST Requests

Below are the differences between a **GET** request and a **POST** request. Note that these are rules that you *don't have to* follow, but you *should* follow them

### 1.1 GET

- used to retrieve info
- data is sent via query string
- info is plainly visible in the URL!
- limited amount of data can be sent (URL's are 2048 characters)

In our HTML form, it would look something like this:

```html
<form action="/tacos" method="get">
    <input type="text" name="meat" id="">
    <input type="number" name="qty" id="">
    <button type="submit">Submit</button>
</form>
```

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img1.jpg?raw=true)

When we submit this form, we are taken to a new URL that looks like this:

```
file:///C:/tacos?meat=tofu&qty=3
```

### 1.2 POST

- used to post data to the server
- used to write / create / update
- data is sent via request body, not a query string
- can send any sort of data (JSON!)

We will now create the same form but this time the method will be POST

```html
<form action="/tacos" method="post">
    <input type="text" name="meat" id="">
    <input type="number" name="qty" id="">
    <button type="submit">Submit</button>
</form>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img2.jpg?raw=true)

When we click submit, we get this page:

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/main/34-RESTful-Routes/img-for-notes/img3.jpg?raw=true)

It shows this because we didn't get any response back and we don't see any query string. For now that you have to trust that it's part of the response body.