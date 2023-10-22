const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('landingpage');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/help', (req, res) => {
    res.render('help');
});

router.get('/student-participation-record-student', (req, res) => {
    res.render('student-participation-record-student');
});

router.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name; // Get the username from the session
        const last_name = req.session.last_name; // Get the username from the session
        res.render('dashboard', { first_name, last_name });
    } else {
        res.redirect('/login'); // Redirect if the user is not authenticated
    }
});

router.get('/dashboard-add-student', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name; 
        res.render('dashboard-add-student', { first_name, last_name });
    } else {
        res.redirect('/login'); 
    }
});

router.get('/college-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name;
        res.render('college-events-admin', { first_name, last_name });
    } else {
        res.redirect('/login');
    }
});

router.get('/college-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name;
        res.render('college-events-edit', { first_name, last_name });
    } else {
        res.redirect('/login');
    }
});

router.get('/university-events-admin', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name; 
        const last_name = req.session.last_name;
        res.render('university-events-admin', { first_name, last_name });
    } else {
        res.redirect('/login');
    }
});

router.get('/university-events-edit', (req, res) => {
    if (req.session.isAuthenticated) {
        const first_name = req.session.first_name;
        const last_name = req.session.last_name;
        res.render('university-events-edit', { first_name, last_name });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;