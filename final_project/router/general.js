const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
      resolve(books);
    }).then((books) => {
      return res.status(200).json(JSON.stringify(books));
    });
  });
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      resolve(books[isbn]);
    });
    return res.status(200).json(book);
  });
  
  // Get book details based on author
  public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve, reject) => {
      resolve(Object.values(books).filter(book => book.author === author));
    });
    return res.status(200).json(booksByAuthor);
  });
  
  // Get all books based on title
  public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      resolve(Object.values(books).filter(book => book.title === title));
    });
    return res.status(200).json(booksByTitle);
  });
  
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
