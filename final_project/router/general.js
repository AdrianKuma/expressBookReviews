const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const { v4: uuidv4 } = require('uuid');

const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
const {username, password} = req.body;
if(!username || !password){
  return res.status(400).send('username and password are required');
}
const userAlreadyAdded = users.find((userAdded)=> userAdded.username === username)
if(userAlreadyAdded){
  res.send('this user already exists')
}
else{
  const userID = uuidv4();
  const newUser = {id:userID,username, password}
  users.push(newUser);
  res.send(`user with username: ${username} has been registered`)
}
});

public_users.get('/register', (req,res) =>{
  res.send(users);
})

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const booksList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 100);
    });
    if (booksList) {
      res.send(JSON.stringify(booksList));
    } else {
      return res.status(404).json({ message: 'No books found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    
    const foundBook = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books[isbn]);
      }, 100);
    });
    
    if (foundBook) {
      return res.status(200).json({ message: foundBook });
    } else {
      return res.status(404).json({ message: 'There is no book with that isbn' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    const booksAuthor = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(books).filter(book => book.author === author));
      }, 100);
    });
    if(booksAuthor){
      return res.status(300).json({message: booksAuthor});
    }
    else{
      return res.status(404).json({message: 'There is no book with that author'})
    }
    
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' }); 
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    const booksTitle = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(books).filter(book => book.title === req.params.title));
      }, 100);
      if(booksTitle){
        return res.status(300).json({message: booksTitle});
      }
      else{
        return res.status(404).json({message: 'There is no book with that title'})
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const foundReview = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books[isbn]);
      }, 100);
    });
    if(foundReview){
      const review = foundReview.reviews
      return res.status(300).json({message: review});
    }
    else{
      return res.status(404).json({message: 'There is no book with that isbn'})
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports.general = public_users;
