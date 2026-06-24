const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  // Generate a JWT and store it in the session
  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  req.session.authorization = { access_token: token };

  return res.status(200).json({message: "Login successful!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const review = req.query.review;
  const isbn = req.params.isbn;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Store the review under the user's name
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review successfully added!", reviews: books[isbn].reviews});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user!" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: `Review for ISBN ${isbn} deleted`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
