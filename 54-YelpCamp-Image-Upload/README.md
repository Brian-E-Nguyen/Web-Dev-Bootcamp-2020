# Section 54 - YelpCamp: Image Upload

## 1. Intro to Image Upload Process

We will now tackle on uploading an image to our website. It's not from anything that we've learned from this course, but it's a nice-to-have. Instead of typing an image URL, which is garbage, we could upload a single or multiple files. This is a multi-step process and there are two things you need to know upfront:

1. a regular HTML form is not able to send files to our server, so we will have to change our form to do that
2. we need to store the images somewhere, and we don't store them in Mongo because image file sizes are very large. Instead, we will use a tool called _Cloudinary_ that stores photos and lets us easily retrieve them

We will set up our form so that it accepts files, and it will hit our server and then our endpoint somewhere. Then we will take the files and store in _Cloudinary_; the tool will then send us the URL to our images, then we can store the URL's in our Mongo DB