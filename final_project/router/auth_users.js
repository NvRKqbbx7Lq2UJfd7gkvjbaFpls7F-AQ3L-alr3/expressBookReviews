const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
	// check if the username is valid
	let userswithsamename = users.filter((user) => {
		return user.username === username;
	});
	return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
	// check if username and password match the one we have in records.
	let validusers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in" });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({
			data: password
		}, 'access', { expiresIn: 60 * 60 });

		req.session.authorization = {
			accessToken, username
		};
		return res.status(200).send({ message: `User ${username} successfully logged in` });
	} else {
		return res.status(208).json({ message: "Invalid Login. Check username and password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
    const username = req.session.authorization.username; // stored in session
    const isbn = req.params.isbn; // given by url
    //const review = req.body.review; // sent as a normal request
    const review = req.query.review; // can be used if sending from url
	const reviews = books[isbn]["reviews"];
    const numReviews = Object.keys(reviews).length+1;
    reviews[username] = { "review": review };
	//console.log(`adding review for book with isbn: ${isbn}`);
	return res.status(200).json({message: `${username} added review to ${books[isbn]["title"]}: ${review} `});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
