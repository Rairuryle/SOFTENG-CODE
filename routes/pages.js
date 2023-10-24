const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars'); 

const app = express();

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials' // Specify the partials directory
}));
app.set('view engine', 'hbs');

router.get('/', (req, res) => {
    res.render('landingpage', { title: 'Landing Page | LSU Events and Attendance Tracking Website' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Register | LSU Events and Attendance Tracking Website' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login | LSU Events and Attendance Tracking Website' });
});

router.get('/help', (req, res) => {
    res.render('help', { title: 'Help and Resources | LSU Events and Attendance Tracking Website' });
});

router.get('/student-participation-record-student', (req, res) => {
    res.render('student-participation-record-student', { title: 'Student Participation Record | LSU Events and Attendance Tracking Website' });
});

router.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name; // Get the username from the session
        const last_name = req.session.last_name; // Get the username from the session
        res.render('dashboard', { first_name, last_name, title: 'Dashboard | LSU Events and Attendance Tracking Website' });
    } else {
        res.redirect('/login'); // Redirect if the user is not authenticated
    }
});

router.get('/dashboard-add-student', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name; 
        res.render('dashboard-add-student', { first_name, last_name, title: 'Dashboard Add Student Profile | LSU Events and Attendance Tracking Website' });
    } else {
        res.redirect('/login'); 
    }
});

router.get('/college-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name;
        res.render('college-events-admin', { first_name, last_name, title: 'Admin Main Page | LSU Events and Attendance Tracking Website' });
    } else {
        res.redirect('/login');
    }
});

router.get('/college-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name;
        res.render('college-events-edit', { first_name, last_name, title: 'Admin Edit Page | LSU Events and Attendance Tracking Website' });
    } else {
        res.redirect('/login');
    }
});

router.get('/university-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name; 
        const last_name = req.session.last_name;
        res.render('university-events-admin', { first_name, last_name, title: 'Admin Main Page | LSU Events and Attendance Tracking Website' });
    } else {
        res.redirect('/login');
    }
});

router.get('/university-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name;
        res.render('university-events-edit', { first_name, last_name, title: 'Admin Edit Page | LSU Events and Attendance Tracking Website' });
    } else {
        res.redirect('/login');
    }
});



module.exports = router;