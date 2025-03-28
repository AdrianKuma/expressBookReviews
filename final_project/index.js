const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books = require('./router/booksdb.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));
app.use("/customer/auth/*", function auth(req, res, next) {


    // Write the authentication mechanism here

});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.get('/search', (req, res) => {
    const searchType = req.query.searchType;
    const searchTerm = req.query.searchTerm;
    let results = {}; // Initialize results as an empty object

    if (searchTerm) {
        for (const bookId in books) {
            if (searchType === 'author' && books[bookId].author.toLowerCase().includes(searchTerm.toLowerCase())) {
                results[bookId] = books[bookId];
            } else if (searchType === 'isbn' && bookId.toLowerCase().includes(searchTerm.toLowerCase())) {
                results[bookId] = books[bookId];
            } else if (searchType === 'title' && books[bookId].title.toLowerCase().includes(searchTerm.toLowerCase())) {
                results[bookId] = books[bookId];
            }
        }
    } else {
        results = books; // If no search term, display all books
    }

    res.render('index', { books: results }); // Render with filtered results
});

app.listen(PORT, () => console.log("Server is running"));