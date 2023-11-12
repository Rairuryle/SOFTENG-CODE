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

// app.get('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Error destroying session:', err);
//         }

//         res.redirect('/login?isLoggedOut=true');
//     });
// });

app.use(bodyParser.urlencoded({ extended: true }));

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

    // Check if the user with the provided ID number exists in the student table
    db.query('SELECT id_number FROM student WHERE id_number = ?', [idnumberInput], async (error, results) => {
        if (error) {
            console.log(error);
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
                    return res.status(200).json({
                        message: `Account created for ${idnumberInput}`
                    });
                }
            });
        } else {
            return res.status(400).json({ error: 'ID number already in use', idNumber: idnumberInput });
        }

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
    });
});

app.get('/dashboard/search', (req, res) => {
    const idNumber = req.query.gridsearchIDNumber;

    db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ studentFound: false });
        } else {
            if (results.length > 0) {
                // Student found
                const studentData = results[0];
                res.status(200).json({ studentFound: true, studentData });
            } else {
                res.status(404).json({ studentFound: false });
            }
        }
    });
});

function searchStudentByGridsearchIDNumber(gridsearchIDNumber, callback) {
    db.query('SELECT * FROM student WHERE id_number = ?', [gridsearchIDNumber], (error, results) => {
        if (error) {
            console.log(error);
            return callback({ studentFound: false });
        } else {
            if (results.length > 0) {
                const studentData = results[0]; // Assuming there's only one matching student

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

// app.post('/university-events-admin/search', (req, res) => {
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
//                 res.render('university-events-admin', {
//                     first_name: req.session.first_name,
//                     last_name: req.session.last_name,
//                     studentData: studentData,
//                     title: 'Admin Main Page | LSU Events and Attendance Tracking Website'
//                 });
//             } else {
//                 res.render('university-events-admin', {
//                     first_name: req.session.first_name,
//                     last_name: req.session.last_name,
//                     studentData: null, // You can pass null or a message to indicate no results
//                     title: 'Admin Main Page | LSU Events and Attendance Tracking Website'
//                 });
//             }
//         }
//     });
// });


app.post('/insert-event-database', (req, res) => {
    console.log(req.body);

    const {
        eventnameInput,
        startDateEvent,
        endDateEvent,
        eventScope,
        eventDays,
    } = req.body;

    const formattedStartDate = new Date(startDateEvent).toISOString().substring(0, 10);
    const formattedEndDate = new Date(endDateEvent).toISOString().substring(0, 10);

    db.query('SELECT event_name FROM event WHERE event_name = ?', [eventnameInput], async (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error checking for existing event' });
        }

        // Insert the student data into the student table if it doesn't already exist
        if (results.length === 0) {
            // Check if the event with the provided name already exists in the event table
            db.query('INSERT INTO event SET ?', {
                event_name: eventnameInput,
                event_date_start: formattedStartDate,
                event_date_end: formattedEndDate,
                event_scope: eventScope,
                event_days: eventDays,
            }, (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: 'Error inserting event data' });
                } else {
                    console.log(results);

                    // Fetch all events after adding the new event
                    db.query('SELECT * FROM event', (error, events) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ error: 'Error fetching events' });
                        } else {
                            // Return the updated list of events to the client
                            return res.status(200).json({
                                message: `Event ${eventnameInput} successfully created`,
                                events: events,
                            });
                        }
                    });
                }
            });
        } else {
            return res.status(400).json({ error: 'There is already an existing event', eventname: eventnameInput });
        }

        req.session.eventData = {
            event_name: eventnameInput,
            event_date_start: formattedStartDate,
            event_date_end: formattedEndDate,
            event_scope: eventScope,
            event_days: eventDays,
        };
    });
});

function getEventRoute(eventNameSpecific, callback) {
    db.query('SELECT * FROM event WHERE event_name = ?', [eventNameSpecific], (error, results) => {
        if (error) {
            console.error('Error in SQL query:', error);
            return callback({ eventFound: false });
        } else {
            if (results.length > 0) {
                const eventData = results[0]; // Assuming there's only one matching event

                return callback({ eventFound: true, eventData });
            } else {
                return callback({ eventFound: false });
            }
        }
    });
}

app.get('/university-events-admin/eventroute', (req, res) => {
    const eventNameSpecific = req.query.eventNameSpecific;
    getEventRoute(eventNameSpecific, (result) => {
        res.status(result.eventFound ? 200 : 500).json(result);
    });
});

// // Add a new route for deleting an event
// app.post('/delete-event', (req, res) => {
//     const eventNameToDelete = req.body.eventNameToDelete; // Adjust the property name based on your form data

//     db.query('DELETE FROM event WHERE event_name = ?', [eventNameToDelete], (error, results) => {
//         if (error) {
//             console.error('Error in SQL query:', error);
//             return res.status(500).json({ error: 'Error deleting event' });
//         } else {
//             console.log(results);

//             // Fetch all events after deleting the event
//             db.query('SELECT * FROM event', (error, events) => {
//                 if (error) {
//                     console.error('Error in SQL query:', error);
//                     return res.status(500).json({ error: 'Error fetching events' });
//                 } else {
//                     // Return the updated list of events to the client
//                     return res.status(200).json({
//                         message: `Event ${eventNameToDelete} successfully deleted`,
//                         events: events,
//                     });
//                 }
//             });
//         }
//     });
// });



// app.put('/update-event/:eventId', (req, res) => {
//     const eventId = req.params.eventId;
//     const updatedEventData = req.body; // Contains the updated event information

//     console.log('Received update request for event ID:', eventId);
//     console.log('Updated event data:', updatedEventData);

//     // ... your existing code ...

//     db.query(
//         'UPDATE event SET event_name = ?, event_date_start = ?, event_date_end = ? WHERE event_id = ?',
//         [updatedEventData.eventname, updatedEventData.startdate, updatedEventData.enddate, eventId],
//         (error, results) => {
//             if (error) {
//                 console.error('Error updating event:', error);
//                 res.status(500).json({ error: 'Error updating event' });
//             } else {
//                 console.log('Event updated successfully');
//                 res.status(200).json({ message: 'Event updated successfully' });
//             }
//         }
//     );
// });

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})