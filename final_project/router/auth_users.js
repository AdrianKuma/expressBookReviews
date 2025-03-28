require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 

  return users.some(user => user.username === username && user.password === password);

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
      return res.status(404).json({ message: "User not found" });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  req.session.authorization = { accessToken, username };
  
  return res.status(200).json({ message: "Login successful", accessToken });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
