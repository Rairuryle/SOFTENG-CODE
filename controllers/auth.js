const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session'); 
const app = express();

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
        
        db.query('INSERT INTO admin SET?', { 
            last_name: lastnameRegister, 
            first_name: firstnameRegister, 
            organization: organizationRegister, 
            username: username, 
            password: hashedPassword }, (error, results) => {
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
                message: 'Please provide both username and password'
            });
        }

        db.query('SELECT * FROM admin WHERE username = ?', [username], async (error, results) => {
            if (error) {
                console.log(error);
                return res.render('login', {
                    message: 'An error occurred while fetching data. Please try again.'
                });
            }

            if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
                return res.render('login', {
                    message: 'Username or password is incorrect'
                });
            } else {
                // If the username and password are correct, create a JWT token for authentication
                const user = results[0];
                console.log("User data from the database:", user);
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log('Token is: ' + token);

                // Store the token in a cookie
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                };
                res.cookie('jwt', token, cookieOptions);

                // Store user data in the session
                req.session.isAuthenticated = true;

                req.session.adminData = {
                    last_name: user.last_name,
                    first_name: user.first_name,
                    organization: user.organization,
                    username: user.username
                };

                console.log("User logged in:", user.username);
                console.log("User organization:", user.organization);

                res.redirect('/dashboard');
            }
        });
    } catch (error) {
        console.error(error);
    }
};

