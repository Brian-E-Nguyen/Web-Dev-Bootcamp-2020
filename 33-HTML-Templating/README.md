# 33. Creating Dynamic HTML With Templating

## 1. What is Templating?

Each subreddit page follows a pattern. They have a theme, "about community" box, members online, posts, join button, etc. These are not created by hand one at a time. Instead, **templates** are used.

**Templating** allows us to define a preset "pattern" for a webpage that we can dynamically modify with. For example, we could define a single "Search" template that displays all the results for a given search term. We don't know what the term is or how many results there are ahead of time. The webpage is created on the fly. The end-goal is to use logic to create HTML pages

We will be using **Embedded JavaSccript (EJS)** for this course because it's very popular and it uses actual JavaScript syntax. You wouldn't have to learn new syntax.