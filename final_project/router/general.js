const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password are missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const response = await axios.get('http://localhost:5000/');
  return res.status(200).json(response.data);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  return res.status(200).json(response.data);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author; // Extract author from URL parameter
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books by author:", error); // Log error details
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});
  
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
