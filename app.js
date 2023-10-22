const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const session = require('express-session'); // Import express-session
const authMiddleware = require('./middleware/authMiddleware'); // Import the authentication middleware
const bodyParser = require('body-parser'); // For parsing form data


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

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/university-events-admin', (req, res) => {
    console.log(req.body);

    const { lastnameInput, firstnameInput, middlenameInput, idnumberInput, departmentInput, courseInput, yearInput } = req.body;

    db.query('SELECT id_number FROM student WHERE id_number = ?', [idnumberInput], async (error, results) => {
        if(error) {
            console.log(error);
        }
        
        db.query('INSERT INTO student SET?', { id_number: idnumberInput, last_name: lastnameInput, first_name: firstnameInput, middle_name: middlenameInput, department_name: departmentInput, course_name: courseInput, year_level: yearInput }, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                res.redirect('/university-events-admin');
            }
        })
    });
})

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})