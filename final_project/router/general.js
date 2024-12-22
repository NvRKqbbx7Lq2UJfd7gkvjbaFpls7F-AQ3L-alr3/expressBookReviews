const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
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
public_users.get('/register',function (req, res) {
	const registeredUsers = req.params.isbn;
	console.log(`looking for user: ${registeredUsers}`);
	return res.json(users);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	console.log(`looking for isbn: ${isbn}`);
	return res.json(books[isbn]);
});

// Get book details based on author
// localhost:5000/author/Chinua%20Achebe
public_users.get('/author/:author',function (req, res) {
	const author = req.params.author;
	console.log(`looking for author: ${author}`);
	const booksByAuthor = Object.values(books).filter(book =>
		book.author.toLowerCase() === author.toLowerCase()
	);
	return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
	const title = req.params.title;
	console.log(`looking for title: ${title}`);
	return res.json(
		Object.values(books).filter(book =>
			book.title.toLowerCase() === title.toLowerCase()
		)
	);

});

// Get reviews for the book
public_users.get('/review/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	const reviews = books[isbn].reviews;
	console.log(`looking for reviews for book with isbn: ${isbn}`);
	return res.json(Object.values(reviews));
});

module.exports.general = public_users;
