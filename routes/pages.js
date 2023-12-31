const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const exphbs = require('express-handlebars');

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials' // Specify the partials directory
}));

app.set('view engine', 'hbs');

router.get('/', (req, res) => {
    res.render('landingpage', {
        title: 'Landing Page | LSU Events and Attendance Tracking Website'
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register | LSU Events and Attendance Tracking Website'
    });
});

router.get('/login', (req, res) => {
    const isLoggedOut = req.query.isLoggedOut === 'true';

    res.render('login', {
        title: 'Login | LSU Events and Attendance Tracking Website',
        isLoggedOut: isLoggedOut
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }

        res.redirect('/login?isLoggedOut=true');
    });
});

router.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help and Resources | LSU Events and Attendance Tracking Website'
    });
});

router.get('/student-participation-record', (req, res) => {
    const idNumber = req.query.id_number;
    const adminData = req.session.adminData;
    const departmentName = req.session.departmentName;
    const currentURL = req.url;
    const isAdminURL = currentURL.includes("admin");
    const isStudentURL = currentURL.includes("student");
    const isRecordPage = isAdminURL || isStudentURL;
    const eventData = req.session.eventData;

    db.query('SELECT * FROM event', (error, events) => {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            const institutionalEvents = events.filter(event => event.event_scope === 'INSTITUTIONAL');
            const collegeEvents = events.filter(event => event.event_scope === departmentName);

            db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
                if (error) {
                    console.log(error);
                    res.redirect('/');
                } else {
                    if (results.length > 0) {
                        const studentData = results[0];
                        res.render('student-participation-record', {
                            idNumber: idNumber,
                            adminData,
                            studentData,
                            eventData,
                            isAdminURL,
                            isStudentURL,
                            isRecordPage,
                            institutionalEvents,
                            collegeEvents,
                            events: events.map(event => ({
                                ...event,
                                formattedStartDate: event.event_date_start.toLocaleDateString(),
                                formattedEndDate: event.event_date_end.toLocaleDateString(),
                            })), // Pass the events with formatted dates to the template
                            title: 'LSU Events and Attendance Tracking Website',
                        });
                    } else {
                        res.redirect('/');
                    }
                }
            });
        }
    });
    // const idNumber = req.query.id_number; // Get the ID number from the query parameters
    // const adminData = req.session.adminData;
    // const studentData = req.session.studentData;
    // const currentURL = req.url; // Get the current URL
    // // Determine if the URL contains "admin"
    // const isAdminURL = currentURL.includes("admin");

    // db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
    //     if (error) {
    //         console.log(error);
    //         res.redirect('/'); // Handle the error, maybe redirect to the dashboard
    //     } else {
    //         if (results.length > 0) {
    //             const studentData = results[0]; // Assuming there's only one matching student
    //             // Render your university-events-admin template with the student data
    //             res.render('student-participation-record', {
    //                 adminData,
    //                 studentData,
    //                 isUSGorSAO,
    //                 isAdminURL: isAdminURL,
    //                 title: 'Student Participation Record | LSU Events and Attendance Tracking Website'
    //             });
    //         } else {
    //             // Handle the case where the student is not found
    //             res.redirect('/');
    //         }
    //     }
    // });
});

router.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated) {
        const adminData = req.session.adminData;
        const isUSGorSAO = adminData.organization === "USG" || adminData.organization === "SAO";
        const studentData = req.session.studentData;

        res.render('dashboard', {
            adminData,
            isUSGorSAO,
            studentData,
            title: 'Dashboard | LSU Events and Attendance Tracking Website'
        });
    } else {
        res.redirect('/login'); // Redirect if the user is not authenticated
    }
});

router.get('/dashboard-add-student', (req, res) => {
    if (req.session.isAuthenticated) {
        const adminData = req.session.adminData;
        const isUSGorSAO = adminData.organization === "USG" || adminData.organization === "SAO";

        let errorMessage = '';

        // Check if there's an error message in the session (e.g., ID number already in use)
        if (req.session.errorMessage) {
            errorMessage = req.session.errorMessage;
            // Clear the error message from the session to avoid showing it again
            delete req.session.errorMessage;
        }

        res.render('dashboard-add-student', {
            adminData,
            isUSGorSAO,
            title: 'Dashboard Add Student Profile | LSU Events and Attendance Tracking Website',
            errorMessage: errorMessage
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/university-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const idNumber = req.query.id_number;
        const adminData = req.session.adminData;
        const departmentName = req.session.departmentName;
        const isUSGorSAO = adminData.organization === "USG" || adminData.organization === "SAO";
        const isUSG = adminData.organization === "USG";
        const isSAO = adminData.organization === "SAO";
        const isCollege = departmentName === adminData.organization;
        const currentURL = req.url;
        const isAdminURL = currentURL.includes("admin");
        const isEditURL = currentURL.includes("edit");
        const isAdminPageURL = isAdminURL || isEditURL;
        const isStudentURL = currentURL.includes("student");
        const isRecordPage = isAdminURL || isStudentURL;
        const eventData = req.session.eventData;

        db.query('SELECT * FROM event', (error, events) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard');
            } else {
                const institutionalEvents = events.filter(event => event.event_scope === 'INSTITUTIONAL');
                const collegeEvents = events.filter(event => event.event_scope === departmentName);

                db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
                    if (error) {
                        console.log(error);
                        res.redirect('/dashboard');
                    } else {
                        if (results.length > 0) {
                            const studentData = results[0];
                            res.render('university-events-admin', {
                                adminData,
                                studentData,
                                departmentName,
                                isUSGorSAO,
                                isUSG,
                                isSAO,
                                isCollege,
                                isAdminURL,
                                isEditURL,
                                isAdminPageURL,
                                isStudentURL,
                                isRecordPage,
                                eventData,
                                institutionalEvents,
                                collegeEvents,
                                idNumber: idNumber,
                                events: events.map(event => ({
                                    ...event,
                                    formattedStartDate: event.event_date_start.toLocaleDateString(),
                                    formattedEndDate: event.event_date_end.toLocaleDateString(),
                                })), // Pass the events with formatted dates to the template
                                title: 'Admin Main Page | LSU Events and Attendance Tracking Website',
                            });
                        } else {
                            res.redirect('/dashboard');
                        }
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/university-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const idNumber = req.query.id_number;
        const adminData = req.session.adminData;
        const departmentName = req.session.departmentName;
        const isUSGorSAO = adminData.organization === "USG" || adminData.organization === "SAO";
        const isUSG = adminData.organization === "USG";
        const isSAO = adminData.organization === "SAO";
        const isCollege = departmentName === adminData.organization;
        const currentURL = req.url;
        const isAdminURL = currentURL.includes("admin");
        const isEditURL = currentURL.includes("edit");
        const isAdminPageURL = isAdminURL || isEditURL;
        const isStudentURL = currentURL.includes("student");
        const isRecordPage = isAdminURL || isStudentURL;
        const eventData = req.session.eventData;

        db.query('SELECT * FROM event', (error, events) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard');
            } else {
                const institutionalEvents = events.filter(event => event.event_scope === 'INSTITUTIONAL');
                const collegeEvents = events.filter(event => event.event_scope === departmentName);

                db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
                    if (error) {
                        console.log(error);
                        res.redirect('/dashboard');
                    } else {
                        if (results.length > 0) {
                            const studentData = results[0];
                            res.render('university-events-edit', {
                                adminData,
                                studentData,
                                departmentName,
                                isUSGorSAO,
                                isUSG,
                                isSAO,
                                isCollege,
                                isAdminURL,
                                isEditURL,
                                isAdminPageURL,
                                isStudentURL,
                                isRecordPage,
                                eventData,
                                institutionalEvents,
                                collegeEvents,
                                events: events.map(event => ({
                                    ...event,
                                    formattedStartDate: event.event_date_start.toLocaleDateString(),
                                    formattedEndDate: event.event_date_end.toLocaleDateString(),
                                })), // Pass the events with formatted dates to the template
                                title: 'Admin Edit Page | LSU Events and Attendance Tracking Website',
                            });
                        } else {
                            res.redirect('/dashboard');
                        }
                    }
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/college-events', (req, res) => {
    // Assuming you're using sessions to manage authentication
    if (req.session.isAuthenticated) {
        const departmentName = req.session.departmentName;

        db.query('SELECT * FROM event WHERE event_scope = ?', [departmentName], (error, events) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Error fetching college events' });
            } else {
                res.status(200).json({ collegeEvents: events });
            }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});


module.exports = router;