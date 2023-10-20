const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

    const { lastnameRegister, firstnameRegister, organizationRegister, username, password, passwordConfirm } = req.body;

    db.query('SELECT username FROM admin WHERE username = ?', [username], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('register', {
                message: 'That username is already in use'
            })
        } else if( password !== passwordConfirm ) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        console.log("Hashed Password (Registration):", hashedPassword);
        
        db.query('INSERT INTO admin SET?', { last_name: lastnameRegister, first_name: firstnameRegister, organization: organizationRegister, username: username, password: hashedPassword }, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                console.log(results);
                res.redirect('/login');
            }
        })
    });
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('login', {
                message: 'Please provide both username and password.'
            });
        }

        db.query('SELECT * FROM admin WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('login', {
                    message: 'An error occurred while fetching data. Please try again.'
                });
            }

            if (results.length === 0) {
                console.log("User not found:", username);
                return res.render('login', {
                    message: 'User not found. Please try again.'
                });
            }

            const user = results[0];
            console.log("User data from the database:", user);

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                console.log("Incorrect password for user:", username);
                return res.render('login', {
                    message: 'Incorrect password. Please try again.'
                });
            } else {
                // Set the session variable to indicate that the user is authenticated
                req.session.isAuthenticated = true;
                console.log("User logged in:", username);

                // User successfully logged in
                return res.redirect('/dashboard');
            }
        });
    } catch (error) {
        console.log(error);
        return res.render('login', {
            message: 'An error occurred. Please try again.'
        });
    }
};
