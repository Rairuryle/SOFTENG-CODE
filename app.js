const express = require('express');
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
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

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials' // Specify the partials directory
}));

app.set('view engine', 'hbs');

// Configure express-session
app.use(session({
    secret: 'kakaka', // Replace with a strong, random key
    resave: true,
    saveUninitialized: true
}));

db.connect((error) => {
    if (error) {
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

// app.get('/university-events-admin', (req, res) => {
//     if (req.session.isAuthenticated) {
//         const first_name = req.session.first_name;
//         const last_name = req.session.last_name;
//         const studentData = req.session.studentData;

//         res.render('university-events-admin', { first_name, last_name, studentData, title: 'Admin Main Page | LSU Events and Attendance Tracking Website' });
//     } else {
//         res.redirect('/login');
//     }
// });

// app.post('/university-events-admin', (req, res) => {
//     console.log(req.body);

//     const {
//         lastnameInput,
//         firstnameInput,
//         middlenameInput,
//         idnumberInput,
//         departmentInput,
//         courseInput,
//         yearInput,
//         activeStatusInput,
//         exemptionStatusInput,
//     } = req.body;

//     const activeStatus = activeStatusInput === "ACTIVE" ? 1 : 0;
//     const exemptionStatus = exemptionStatusInput === "EXEMPTED" ? 1 : 0;

//     // Check if the user with the provided ID number exists in the student table
//     db.query('SELECT id_number FROM student WHERE id_number = ?', [idnumberInput], async (error, results) => {
//         if (error) {
//             console.log(error);
//         }

//         if (results.length > 0) {
//             return res.render('dashboard-add-student', {
//                 message: 'That ID Number is already in use'
//             })
//             res.redirect('/dashboard-add-student'); // Redirect to the dashboard-add-student route
//         }

//         // Insert the student data into the student table if it doesn't already exist
//         if (results.length === 0) {
//             db.query('INSERT INTO student SET ?', {
//                 id_number: idnumberInput,
//                 last_name: lastnameInput,
//                 first_name: firstnameInput,
//                 middle_name: middlenameInput,
//                 department_name: departmentInput,
//                 course_name: courseInput,
//                 year_level: yearInput,
//                 active_status: activeStatus,
//                 exemption_status: exemptionStatus
//             }, (error, results) => {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log(results);
//                 }
//             });
//         }

//         const activeStatusText = activeStatus === 1 ? "ACTIVE" : "INACTIVE";
//         const exemptionStatusText = exemptionStatus === 1 ? "EXEMPTED" : "NOT EXEMPTED";

//         // Store user-related data in the session
//         req.session.studentData = {
//             id_number: idnumberInput,
//             last_name: lastnameInput,
//             first_name: firstnameInput,
//             middle_name: middlenameInput,
//             department_name: departmentInput,
//             course_name: courseInput,
//             year_level: yearInput,
//             active_status: activeStatusText,
//             exemption_status: exemptionStatusText
//         };

//         // res.redirect('/university-events-admin');
//     });
// });

// app.get('/university-events-admin', (req, res) => {
//     if (req.session.isAuthenticated) {
//         const first_name = req.session.first_name;
//         const last_name = req.session.last_name;
//         const studentData = req.session.studentData;

//         res.render('university-events-admin', { first_name, last_name, studentData, title: 'Admin Main Page | LSU Events and Attendance Tracking Website' });
//     } else {
//         res.redirect('/login');
//     }
// });

app.post('/insert-into-database', (req, res) => {
    console.log(req.body);

    const {
        lastnameInput,
        firstnameInput,
        middlenameInput,
        idnumberInput,
        departmentInput,
        courseInput,
        yearInput,
        activeStatusInput,
        exemptionStatusInput,
    } = req.body;

    // const activeStatus = activeStatusInput === "ACTIVE" ? 1 : 0;
    // const exemptionStatus = exemptionStatusInput === "EXEMPTED" ? 1 : 0;

    // Check if the user with the provided ID number exists in the student table
    db.query('SELECT id_number FROM student WHERE id_number = ?', [idnumberInput], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('dashboard-add-student', {
                message: 'That ID Number is already in use'
            });
            // res.redirect('/dashboard-add-student'); // Redirect to the dashboard-add-student route
        }

        // Insert the student data into the student table if it doesn't already exist
        if (results.length === 0) {
            db.query('INSERT INTO student SET ?', {
                id_number: idnumberInput,
                last_name: lastnameInput,
                first_name: firstnameInput,
                middle_name: middlenameInput,
                department_name: departmentInput,
                course_name: courseInput,
                year_level: yearInput,
                active_status: activeStatusInput,
                exemption_status: exemptionStatusInput
            }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                }
            });
        }

        // const activeStatusText = activeStatus === 1 ? "ACTIVE" : "INACTIVE";
        // const exemptionStatusText = exemptionStatus === 1 ? "EXEMPTED" : "NOT EXEMPTED";

        // Store user-related data in the session
        req.session.studentData = {
            id_number: idnumberInput,
            last_name: lastnameInput,
            first_name: firstnameInput,
            middle_name: middlenameInput,
            department_name: departmentInput,
            course_name: courseInput,
            year_level: yearInput,
            active_status: activeStatusInput,
            exemption_status: exemptionStatusInput
        };

        // res.redirect('/university-events-admin');
    });
});

// app.post('/insert-into-database', (req, res) => {
    

//     // Perform the database insertion here
//     // Example: Insert formData into your database

//     // Respond to the client, indicating success or failure
//     res.json({ message: 'Data inserted successfully' });
// });

function searchStudentByGridsearchIDNumber(gridsearchIDNumber, callback) {
    db.query('SELECT * FROM student WHERE id_number = ?', [gridsearchIDNumber], (error, results) => {
        if (error) {
            console.log(error);
            return callback({ studentFound: false });
        } else {
            if (results.length > 0) {
                const studentData = results[0]; // Assuming there's only one matching student

                // Convert activeStatus and exemptionStatus to text values
                // const activeStatusText = studentData.active_status === 1 ? "ACTIVE" : "INACTIVE";
                // const exemptionStatusText = studentData.exemption_status === 1 ? "EXEMPTED" : "NOT EXEMPTED";

                // // Replace the database values with the text values
                // studentData.active_status = activeStatusText;
                // studentData.exemption_status = exemptionStatusText;

                return callback({ studentFound: true, studentData });
            } else {
                return callback({ studentFound: false });
            }
        }
    });
}

app.get('/university-events-admin/search', (req, res) => {
    const gridsearchIDNumber = req.query.gridsearchIDNumber;
    searchStudentByGridsearchIDNumber(gridsearchIDNumber, (result) => {
        res.status(result.studentFound ? 200 : 500).json(result);
    });
});

// app.get('/college-events-admin/search', (req, res) => {
//     const gridsearchIDNumber = req.query.gridsearchIDNumber;
//     searchStudentByGridsearchIDNumber(gridsearchIDNumber, (result) => {
//         res.status(result.studentFound ? 200 : 500).json(result);
//     });
// });

// app.get('/dashboard/search', (req, res) => {
//     const gridsearchIDNumber = req.query.gridsearchIDNumber;
//     searchStudentByGridsearchIDNumber(gridsearchIDNumber, (result) => {
//         res.status(result.studentFound ? 200 : 500).json(result);
//     });
// });

app.post('/university-events-admin/search', (req, res) => {
    const idNumber = req.body.gridsearchIDNumber; // Get the ID number from the form

    // Query the database to search for the student with the given ID number
    db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error searching for student');
        } else {
            // Check if a student with the provided ID number was found
            if (results.length > 0) {
                const studentData = results[0]; // Assuming there's only one matching student
                res.render('university-events-admin', {
                    first_name: req.session.first_name,
                    last_name: req.session.last_name,
                    studentData: studentData,
                    title: 'Admin Main Page | LSU Events and Attendance Tracking Website'
                });
            } else {
                // No student with the provided ID number was found
                res.render('university-events-admin', {
                    first_name: req.session.first_name,
                    last_name: req.session.last_name,
                    studentData: null, // You can pass null or a message to indicate no results
                    title: 'Admin Main Page | LSU Events and Attendance Tracking Website'
                });
            }
        }
    });
});

// In your server code

app.get('/dashboard/search', (req, res) => {
    const idNumber = req.query.gridsearchIDNumber;

    // Query the database to check if the student with the provided ID number exists
    // If found, send the student data back in the response
    // If not found, send a response indicating that the student was not found
    // You may need to adjust this based on your database structure and query methods

    // Example:
    db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ studentFound: false });
        } else {
            if (results.length > 0) {
                // Student found
                const studentData = results[0]; // Assuming there's only one matching student
                res.status(200).json({ studentFound: true, studentData });
            } else {
                // Student not found
                res.status(404).json({ studentFound: false });
            }
        }
    });
});


// app.post('/dashboard/search', (req, res) => {
//         console.log('Reached /dashboard/search route'); // Add this line for debugging

//     const idNumber = req.body.gridsearchIDNumber; // Get the ID number from the form

//     // Query the database to search for the student with the given ID number
//     db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send('Error searching for student');
//         } else {
//             // Check if a student with the provided ID number was found
//             if (results.length > 0) {
//                 const studentData = results[0]; // Assuming there's only one matching student

//                 // Redirect to the /university-events-admin route with the student data as a query parameter
//                 res.redirect(`/university-events-admin?studentData=${JSON.stringify(studentData)}`);
//             } else {
//                 // No student with the provided ID number was found
//                 res.status(404).send('Student not found');
//             }
//         }
//     });
// });


// app.get('/set-cookie', (req, res) => {
//     // Example: Store student information in a cookie
//     res.cookie('studentInfo', JSON.stringify(studentData));
//     res.send('Cookie set');
//   });

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})