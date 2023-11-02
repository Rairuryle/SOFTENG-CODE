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
    res.render('login', { 
        title: 'Login | LSU Events and Attendance Tracking Website' 
    });
});

router.get('/help', (req, res) => {
    res.render('help', { 
        title: 'Help and Resources | LSU Events and Attendance Tracking Website' 
    });
});

router.get('/student-participation-record', (req, res) => {
    const adminData = req.session.adminData;
    const studentData = req.session.studentData;

    res.render('student-participation-record', { 
        adminData, 
        studentData, 
        title: 'Student Participation Record | LSU Events and Attendance Tracking Website' 
    });
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

router.get('/dashboard-college', (req, res) => {
    if (req.session.isAuthenticated) {
        const adminData = req.session.adminData;
        const isUSGorSAO = adminData.organization === "USG" || adminData.organization === "SAO";

        res.render('dashboard-college', { 
            adminData,
            isUSGorSAO,
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

        res.render('dashboard-add-student', { 
            adminData,
            isUSGorSAO,
            title: 'Dashboard Add Student Profile | LSU Events and Attendance Tracking Website',
        });
    } else {
        res.redirect('/login'); 
    }
});

router.get('/dashboard-add-student-college', (req, res) => {
    if (req.session.isAuthenticated) {
        const adminData = req.session.adminData;
        const isUSGorSAO = adminData.organization === "USG" || adminData.organization === "SAO";

        res.render('dashboard-add-student-college', { 
            adminData,
            isUSGorSAO,
            title: 'Dashboard Add Student Profile | LSU Events and Attendance Tracking Website' 
        });
    } else {
        res.redirect('/login'); 
    }
});

// router.get('/university-events-admin', (req, res) => {
//     if (req.session.isAuthenticated) {
//         const adminData = req.session.adminData; 
//         const studentData = req.session.studentData;
        
//         res.render('university-events-admin', { 
//             adminData,
//             studentData, 
//             title: 'Admin Main Page | LSU Events and Attendance Tracking Website' 
//         });
//     } else {
//         res.redirect('/login');
//     }
// });

router.get('/university-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const idNumber = req.query.id_number; // Get the ID number from the query parameters
        const adminData = req.session.adminData;
        const studentData = req.session.studentData;

        db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard'); // Handle the error, maybe redirect to the dashboard
            } else {
                if (results.length > 0) {
                    const studentData = results[0]; // Assuming there's only one matching student
                    // Render your university-events-admin template with the student data
                    res.render('university-events-admin', {
                        adminData,
                        studentData,
                        title: 'Admin Main Page | LSU Events and Attendance Tracking Website'
                    });
                } else {
                    // Handle the case where the student is not found
                    res.redirect('/dashboard');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/university-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const adminData = req.session.adminData;
        const studentData = req.session.studentData;

        res.render('university-events-edit', { 
            adminData,
            studentData, 
            title: 'Admin Edit Page | LSU Events and Attendance Tracking Website' 
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/college-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const idNumber = req.query.id_number; // Get the ID number from the query parameters
        const adminData = req.session.adminData;
        const studentData = req.session.studentData;

        db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard'); // Handle the error, maybe redirect to the dashboard
            } else {
                if (results.length > 0) {
                    const studentData = results[0]; // Assuming there's only one matching student
                    // Render your university-events-admin template with the student data
                    res.render('college-events-admin', {
                        adminData,
                        studentData,
                        title: 'Admin Main Page | LSU Events and Attendance Tracking Website'
                    });
                } else {
                    // Handle the case where the student is not found
                    res.redirect('/dashboard');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/college-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const idNumber = req.query.id_number; // Get the ID number from the query parameters
        const adminData = req.session.adminData;
        const studentData = req.session.studentData;

        db.query('SELECT * FROM student WHERE id_number = ?', [idNumber], (error, results) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard'); // Handle the error, maybe redirect to the dashboard
            } else {
                if (results.length > 0) {
                    const studentData = results[0]; // Assuming there's only one matching student
                    // Render your university-events-admin template with the student data
                    res.render('college-events-edit', {
                        adminData,
                        studentData,
                        title: 'Admin Edit Page | LSU Events and Attendance Tracking Website'
                    });
                } else {
                    // Handle the case where the student is not found
                    res.redirect('/dashboard');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;