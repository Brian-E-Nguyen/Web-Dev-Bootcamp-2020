# Section 43 - YelpCamp: Errors & Validaiting Data

## 1. Client-Side Form Validations

### 1.1 HTML's `required` Tag

If we were to create a campground without putting any client-side validations, this is what it would look like after we create it:

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img1.jpg?raw=true)

One thing that we can do on the form is to use the native HTML `required` tag on each `<input>` tags

```html
<input class="form-control" type="text" name="campground[title]" id="title" required>
```

![img2](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img2.jpg?raw=true)

This works, but it's not very pretty. What if we wanted the text field to highlight red if there's invalid data? We don't have the option to customize this if we use the `required` tag. Also it depends on the browser. It's not centralized across all browsers

### 1.2 Validating With Boostrap

#### 1.2.1 Basics

Bootstrap comes with its own validation helpers. Link to docs:
- https://getbootstrap.com/docs/5.0/forms/validation/

Along with the `required` tag, it uses the pseudo-classes `:invalid` and `:valid`. Look at the first line of code at the bottom. We are using the `novalidate` tag because we are telling the browser to not validate the form yet, and that's so Bootstrap can take over. Unfortunately, we have to use javascript, which we will talk in a moment

```html
<form class="row g-3 needs-validation" novalidate class="validated-form">
  <div class="col-md-4">
    <label for="validationCustom01" class="form-label">First name</label>
    <input type="text" class="form-control" id="validationCustom01" value="Mark" required>
    <div class="valid-feedback">
      Looks good!
    </div>
```

Let's make changes to our `new.js` form by adding `novalidate` at the starting `<form>` tag and `required` to all `<input>` tags

```html
<form action="/campgrounds" method="post" novalidate>
    <div class="mb-3">
        <label class="form-label" for="title">Title</label>
        <input class="form-control" type="text" name="campground[title]" id="title" required>
    </div>

    ...
```

Right now you are still able to create a campground without any validation, but in order for it to work, we need some JS code. We will put this at the very bottom of our `new.js` file in a `<script>` tag

```js
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
```

#### 1.2.2 Validation in Action

Now here's what it would look like when we try to submit a form with invalid data

![img3](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img3.jpg?raw=true)

And when we do type in valid data, the textbox turns green

![img4](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img4.jpg?raw=true)

We can also provide valid feedback to the user with the class of `.valid-feedback`

```html
<input class="form-control" type="text" name="campground[title]" id="title" required>
    <div class="valid-feedback">
        <p>Looks good!</p>
    </div>

...
```

![img5](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img5.jpg?raw=true)

![img6](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img6.jpg?raw=true)

![img7](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img7.jpg?raw=true)


We should also do the exact same thing for our Edit Campground form as well. Let's move our JS code into our boilerplate code so that we don't have to copy it every time

![img8](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img8.jpg?raw=true)


## 2. Basic Error Handler

On our new/edit campgrounds form, if we were to type in a value for price that isn't able to be casted into a number, then our server would freak out because it's Mongoose that's trying to validate it

![img9](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img9.jpg?raw=true)


```
(node:17476) UnhandledPromiseRejectionWarning: CastError: Cast to ObjectId failed for value "Test" at path "_id" for model "Campground"
```

This is an async error. In our `app.js`, let's set up our error handler

```js
app.use((err, req, res, next) => {
    res.send('Oh boy, something went wrong')
})
```

And then let's make changes to our POST request by adding a try/catch

```js
app.post('/campgrounds', async(req, res) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }
    catch (err) {
        next(err)
    }
});
```

![img10](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img10.jpg?raw=true)

![img11](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/43-YelpCamp-Errors/43-YelpCamp-Errors/img-for-notes/img11.jpg?raw=true)

In the next section, we will have our own error class so that we don't need to put try/catch blocks in every single request code, which would take up a lot of space