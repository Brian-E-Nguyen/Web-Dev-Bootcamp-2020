# Section 50: Authentication From Scratch

Most apps, or anything nowadays, have some sort of authentication. We will make our own authentication (authN) from scratch so that we get an idea how it works. It's really helpful to understand how all of the pieces fit together. This section has two parts:

1. how does authN work, how to store passwords, what it means to salt a password etc.
2. implementing authN in an Express app

![img1](https://github.com/Brian-E-Nguyen/Web-Dev-Bootcamp-2020/blob/50-Authentication-From-Scratch/50-Authentication-From-Scratch/img-for-notes/img1.jpg?raw=true)

## 1. Authentication vs. Authorization

**Authentication** is the process of verifying _who a particular user is_. We typically authenticate with a username/password combo, but we can also use security questions, facial recognition, etc.

**Authorization** is verifying what a specific user has access to. Generally, we authorize after a user has been authenticated. "Now that we know who you are, here is what you are allowed to do and what you're NOT allowed to do"