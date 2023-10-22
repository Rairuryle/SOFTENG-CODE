const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
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

                // Redirect to a dashboard or other authenticated page
                req.session.isAuthenticated = true;
                req.session.first_name = user.first_name; // Store the username in the session
                req.session.last_name = user.last_name; // Store the username in the session
                console.log("User logged in:", username);
                res.redirect('/dashboard');
            }
        });
    } catch (error) {
        console.error(error);
    }
};

// app.get('/dashboard-add-student', (req, res) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).send('Unauthorized');
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send('Unauthorized');
//     }

//     // At this point, the token is verified, and decoded contains the token payload.
//     const userId = decoded.id; // Assuming you stored the user's ID in the token during login

//     // You can now identify the user and display their information.
//     console.log('User ID from token:', userId);

//     // Continue with serving the /records route.
//     res.send('This is the records page.');
//   });
// });


