const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // curl -X POST "localhost:5000/register" -d '{"username": "test", "password": "test123"}' -H 'Content-Type: application/json'
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: `User ${username} successfully registered. Now you can login` });
        } else {
            return res.status(404).json({ message: `User ${username} already exists!` });
        }
    }
    return res.status(404).json({ message: `Unable to register user ${username}.` });
});

// show registered users
public_users.get('/register', function (req, res) {
    const registeredUsers = req.params.isbn;
    console.log(`looking for user: ${registeredUsers}`);
    return res.json({ "registeredusers": users });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Execute the promise and handle the fulfilled and rejected states
    new Promise((resolve, reject) => {
        let success = books;
        if (success) {
            resolve(success);
        } else {
            reject("books now found");
        }
    })
        .then((message) => {
            // This block will execute if the promise is resolved
            return res.json({books: message});

        })
        .catch((error) => {
            // This block will execute if the promise is rejected
            console.error(error); // "The operation failed!"
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Execute the promise and handle the fulfilled and rejected states
    new Promise((resolve, reject) => {
        let success = req.params.isbn;
        if (success) {
            resolve(success);
        } else {
            reject("books now found");
        }
    })
        .then((message) => {
            // This block will execute if the promise is resolved
            console.log(`looking for isbn: ${message}`);
            return res.json({ searchbyisbn: books[message] });
        })
        .catch((error) => {
            // This block will execute if the promise is rejected
            console.error(error); // "The operation failed!"
        });
});

// Get book details based on author
// localhost:5000/author/Chinua%20Achebe
public_users.get('/author/:author', function (req, res) {
        // Execute the promise and handle the fulfilled and rejected states
        new Promise((resolve, reject) => {
            let success = req.params.author;
            if (success) {
                resolve(success);
            } else {
                reject("books now found");
            }
        })
            .then((message) => {
                // This block will execute if the promise is resolved
                console.log(`looking for author: ${message}`);
                const booksByAuthor = Object.values(books).filter(book =>
                    book.author.toLowerCase() === message.toLowerCase()
                );
                return res.json({ searchbyauthor: booksByAuthor });
            })
            .catch((error) => {
                // This block will execute if the promise is rejected
                console.error(error); // "The operation failed!"
            });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
        let success = req.params.title;
        if (success) {
            resolve(success);
        } else {
            reject("books now found");
        }
    })
        .then((message) => {
            // This block will execute if the promise is resolved
            console.log(`looking for title of: ${message}`);
            return res.json({searchbytitle:
                Object.values(books).filter(book =>
                    book.title.toLowerCase() === message.toLowerCase()
                )});
        })
        .catch((error) => {
            // This block will execute if the promise is rejected
            console.error(error); // "The operation failed!"
        });
});

// Get reviews for the book
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    console.log(`looking for reviews for book with isbn: ${isbn}`);
    return res.json({ reviews });
});

module.exports.general = public_users;
