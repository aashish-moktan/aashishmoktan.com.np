---
title: '🧠 Understanding Microtasks vs Macrotasks in Node.js (Made Simple)'
description: 'I have finally found the time, so I took my Eleventy Starter and rebuilt the website. It still looks the same in many parts, but I have refined, improved and changed almost everything.'
discover:
  description: ''
category: tech
key: 'microtasks-vs-macrotasks-in-nodejs'
date: 2024-11-27 07:00:00
lastEdit:
draft: false
---

If you've been diving into the Node.js event loop, you might've heard terms like microtasks and macrotasks. There are two types of queues that Node.js uses to schedule asyncronous operations. But what exactly are they, and how do they affect your code?

In this blog, we'll break down:
- What are microtasks and macrotasks?
- How they're scheduled and executed
- Real examples to understand execution order
- Common pitfalls to avoid

## ⏳ A Quick Refresher: The Event Loop
Node.js runs on a single-threaded, non-blocking event loop. When you run asynchronous code (like setTimeout or a Promise), it doesn't block other operations - instead, it's scheduled for later.
But when exactly it runs depends on whether it's a microtask or a macrotask.

## 🔹 Microtasks: Tiny But Mighty
Microtasks are executed immediately after the currently executing script and before any macrotasks. These include:
- Promose.then()
- Promise.catch()
- Promise.finally()
- process.nextTick() (Node.js-specific)

These are high-priority tasks that run before the event loop continues to the next phase.

## 🔸 Macrotasks: Scheduled Tasks
Macrotasks (also called "tasks") include:
- setTimeout()
- setInterval()
- setImmediate() (NOde.js-specific)
- I/O operations
- UI rendering (in browsers)

These tasks are scheduled for the next iteration of the event loop.

## 🧪 Execution Order Example
Here's a real-world example to see the difference:
```javascript
console.log("Start");

setTimeout(() => {
  console.log("Macrotask: setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask: Promise.then");
});

process.nextTick(() => {
  console.log("Microtask: process.nextTick");
});

console.log("End");
```

### 🔍 Output:
```vbnet
Start
End
Microtask: process.nextTick
Microtask: Promise.then
Macrotask: setTimeout
```

### 🧠 Explanation:
1. Start and End are synchronous.
2. process.nextTick() runs before any other microtasks (even Promises).
3. Then Promise.then() runs.
4. Finally, setTimeout() runs as a macrotask in the next tick of the event loop.


### Execution Order Cheat Sheet
|Task Type                        |Example                           |When It Runs                                               |
|:--------------------------------|:---------------------------------|:----------------------------------------------------------|
|Synchronous                      |console.log()                     |Immediately                                                |
|process.nextTick                 |Node.js only                      |Before any other microtask                                 |
|Microtask                        |Promise.then()                    |After current stack, before macrotasks                     |
|Macrotask                        |setTimeout()                      |Next event loop cycle                                      |

## ⚠️ Common Pitfalls
### 1. Starvation by Microtasks
If you keep scheduling microtasks inside macrotasks, the event loop never gets to process macrotasks.
```javascript
function infiniteMicrotasks() {
  Promise.resolve().then(infiniteMicrotasks);
}

infiniteMicrotasks(); // Freezes everything else
```
### 2. Assuming setTimeout(..., 0) runs immediately
It doesn't! Microtasks still run first

### ✅ When Does This Matter?
- Performance tuning: Overusing microtasks can starve the event loop.
- Debugging async code: Understanding the order helps explain "why isn't my code running yet?"
- Writing libraries/frameworks: Properly scheduling work is key to predictable behavior.

## 🚀 Summary
- Microtasks (Promises, process.nextTick) are executed right after the current operation.
- Macrotasks (setTimeout, setImmediate) are scheduled for the next tick of the event loop.
- Microtasks always run before macrotasks.
- Node.js gives special priority to process.nextTick().

## 📘 Bonus: Visual Flow
```vbnet
Synchronous Code
    ↓
process.nextTick Queue
    ↓
Microtask Queue (Promises)
    ↓
Macrotask Queue (Timers, I/O)
    ↓
Next Event Loop Tick ⟲
```






In this post, we'll explore the three core ways to handle asynchronous code in Node.js:
1. **Callbacks**
2. **Promises**
3. **Async/Await**

By the end, you'll understand not just how to use them, but when and why to choose each.


## 🧠 Why Asynchronous Programming Matters
JavaScript in Node.s runs on a **single thread**. This means that if you perform a blocking tasks - like reading a big file or making an API request -- your entire app halts until that task finishes.

Asynchronous programming lets us avoid that.

You can **start a task, continue with other work**, and **handle the result later** -- without freezing your app.

## 1. 🧩 Callbacks: The Old-School Way
A **callback** is a function passed into another function to be called later - usually after async taks finishes.

**Example:**
```javascript
const fs = require('fs');

fs.readFile('file.txt', 'utf-8', (err, data) => {
    if (err) return console.error(err);
    console.log(data);
})
```

### Problem: Callback Hell 😵‍💫
If you have multiple nested callbacks, your code quickly becomes messy:
```javascript
getUser(userId, (err, user) => {
  getPosts(user, (err, posts) => {
    getComments(posts, (err, comments) => {
      // 😨 deeply nested
    });
  });
});
```

## 2. 🔗 Promises: A Better Approach
A Promise represents a value that may be available now, or in the future, or never:

**Example:**
```javascript
const fs = require('fs/promises');

fs.readFile('file.txt', 'utf8')
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
```

**Benefits:**
- Avoids deeply nested code.
- Can chain multiple async tasks.
- Built into modern JavaScript.

## 3. ⛱ Async/Await: Clean & Modern
**Async/Await** is syntatic sugar over Promises. It lets you write async code that looks like synchronous code -- cleaner and easier to read.

#### Example:
```javascript
const fs = require('fs/promises');

async function readFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readFile();
```

Why it's Awesome:
- Looks synchronous, but it's not.
- Error handling with ==try/catch.==
- Easier to debug and maintain.

## ⚖️ When to Use What?
|Approach              | Use Case                                                      |
:----------------------|:--------------------------------------------------------------|
|Callbacks             |Legacy code or simple utilities                                |
|Promises              |Good for chaining multiple async tasks                         |
|Async/Await           |Preferred for readability, error handling, and modern apps     |

## 🛠 Real-World Example: Fetching Data from an API
Let's see how the same task looks in each style.

### ✅ Using Callback (with request library):
```javascript
const request = require('request');

request('https://api.example.com', (err, res, body) => {
  if (err) return console.error(err);
  console.log(JSON.parse(body));
});
```

### ✅ Using Promise (with axios):
```javascript
const axios = require('axios');

axios.get('https://api.example.com')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

### ✅ Using Async/Await:
```javascript
const axios = require('axios');

async function fetchData() {
  try {
    const response = await axios.get('https://api.example.com');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
```

## 💡 Tips for Working with Async Code
- Never mix callbacks with promises unless absolutely necessary.
- Use **util.promsify** to convert callback-style functions to promises.
- Be careful with loop inside **async** functions (**for...of** works better than **forEach**).
- Always handle errors, even in async functions


## 🚀 Final Thoughts
Understanding callbacks, promises, and async/await is crucial for every Node.js developer. If you've been stuck in callback hell, now's the time to refactor your code and embrace the modern async flow.

Start using ==**async/await**== today -- your future self will thank you.
