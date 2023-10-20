const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const session = require('express-session'); // Import express-session
const authMiddleware = require('./middleware/authMiddleware'); // Import the authentication middleware

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//  parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//  parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'hbs');

// Configure express-session
app.use(session({
    secret: 'kakaka', // Replace with a strong, random key
    resave: true,
    saveUninitialized: true
}));

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL Connected")
    }
})

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.use('/dashboard', authMiddleware);

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})