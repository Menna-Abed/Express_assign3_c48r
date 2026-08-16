//==> Part 1 Node js Internals

//  Q1
/* The event loop is a loop that handles asynchronous operations by continuously checking for completed asynchronous operations
and executes their callbacks when the Call Stack is available, allowing Node.js to manage
thousands of concurrent connections with a single thread
*/


//===========================================================

//  Q2
/*
libuv is a C++ library used by Node.js to provide the Event Loop and handle asynchronous perations.
It also provides a Thread Pool for certain operations and to keep Node.js non-blocking
*/

//===========================================================

//  Q3
/*
Node.js handles asynchronous operations using the Event Loop and libuv.
Long-running operations are handled asynchronously, allowing the main thread to continue executing other code.
When the operation completes, its callback is scheduled for execution.
*/

//===========================================================

//  Q4
/*
The Call Stack executes JavaScript code. The Event Queue stores callbacks that are ready to run.
The Event Loop checks whether the Call Stack is empty and moves ready callbacks from the queue to the Call Stack.
*/

//===========================================================

//  Q5
/*
The Node.js Thread Pool is a group of worker threads provided by libuv to handle certain asynchronous operations.
Its default size is 4 and it can be configured using UV_THREADPOOL_SIZE. for ex: UV_THREADPOOL_SIZE=8
*/

//===========================================================

//  Q6
/*
Node.js executes blocking code synchronously, which means the main thread waits until the operation is completed before executing the next code.
For non-blocking code, Node.js uses asynchronous operations, allowing the main thread to continue executing other tasks while
waiting for the operation to complete.The Event Loop handles the callbacks when the operations finish.
*/

//=============================================================================

//==> Part 2  CRUD Operations Using Express.js
//  Q1
const fs = require("node:fs/promises");
const express = require('express');
const app = express();

app.use(express.json());

app.post('/user', async (req, res) => {

    let data = await fs.readFile("./users.json", {encoding: "utf-8"});
    console.log(data);
    let users = JSON.parse(data);

    const newUser = req.body;
    const emailExists = users.find(user =>user.email === newUser.email);
    if (emailExists) {
        return res.json({message: "Email already exists."});
    }
        newUser.id = users.length + 1;
        users.push(newUser);
        console.log(users);
    await fs.writeFile("./users.json", JSON.stringify(users), {encoding: "utf-8"});
    res.status(201).json({message: "User added successfully."});

});


//======================================================================
//  Q2

app.patch('/user/:id', async (req, res) => {

    const id = Number(req.params.id);
    let data = await fs.readFile("./users.json", { encoding: "utf-8" });
    let users = JSON.parse(data);
    const userExisting = users.find(user => user.id === id);
    if (!userExisting) {
        return res.status(404).json({ message: "User ID not found."});
    }
    const { name, age, email } = req.body;
    if (name !== undefined) {
        userExisting.name = name;
    }
    if (age !== undefined) {
        userExisting.age = age;
    }
    if (email !== undefined) {
        const emailExists = users.find(
            user => user.email === email && user.id !== id
        );
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists." });
        }
        userExisting.email = email;
    }
    await fs.writeFile(
        "./users.json",  JSON.stringify(users), { encoding: "utf-8" }
    );
    res.json({ message: "User updated successfully." });
});
//===========================================================================================
//  Q3

app.delete('/user/:id', async (req, res) => {

    const id = Number(req.params.id);
    let data = await fs.readFile("./users.json", {encoding: "utf-8"});
    let users = JSON.parse(data);
    const userExists = users.find(user => user.id === id);

    if (!userExists) {
        return res.status(404).json({message: "User ID not found."});
        }

    const updatedUsers = users.filter(user => user.id !== id);
    await fs.writeFile("./users.json", JSON.stringify(updatedUsers), {encoding: "utf-8"});

    res.json({message: "User deleted successfully."});
});

//===========================================================================================
//  Q4
app.get('/user/getByName', async (req, res) => {

    let data = await fs.readFile("./users.json", {encoding: "utf-8"});

    let users = JSON.parse(data);
    const name = req.query.name;

    const user = users.find(user => user.name === name);

    if (!user) {
        return res.status(404).json({message: "User name not found."});
    }
    res.json(user);
});

//===========================================================================================
//  Q5
app.get('/user', async (req, res) => {

    let data = await fs.readFile("./users.json", {encoding: "utf-8"});
    let users = JSON.parse(data);

    res.json(users);
});

//===========================================================================================
//  Q6
// Note, I already added a new user in my users.json file manually before running this code so don’t be surprised when you see what happened :>>

app.get('/user/filter', async (req, res) => {

    let data = await fs.readFile("./users.json", {encoding: "utf-8"});

    let users = JSON.parse(data);

    const minAge = Number(req.query.minAge);
    const filteredUsers = users.filter(user => user.age >= minAge);

    if (filteredUsers.length === 0) {
        return res.status(404).json({message: "no user found"});
    }
    res.json(filteredUsers);
});

//===========================================================================================
//  Q7

app.get('/user/:id', async (req, res) => {

    const id = Number(req.params.id);

    let data = await fs.readFile("./users.json", {encoding: "utf-8"});

    let users = JSON.parse(data);
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({message: "User not found."});
    }
    res.json(user);
});
//===========================================================================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: err.message});
});

app.listen(3000,()=>{
    console.log('Server is listening on port 3000');
})
