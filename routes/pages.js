const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const exphbs = require('express-handlebars');
const { getUrlFlags, isMainOrgs, isExtraOrgs } = require('./utils');

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
    partialsDir: __dirname + '/views/partials'
}));

app.set('view engine', 'hbs');

router.get('/', (req, res) => {
    res.render('landingpage', {
        title: 'Landing Page | LSU Events and Attendance Tracking Website'
    });
});

router.get('/register', (req, res) => {
    const adminData = req.session.adminData;
    const organization = adminData.organization;
    const departmentName = req.session.departmentName;

    const CAS_ABO = ["JSWAP", "LABELS", "LSUPS", "POLISAYS"];
    const CBA_ABO = ["JFINEX", "JMEX", "JPIA"];
    const CCSEA_ABO = ["ALGES", "ICpEP", "IIEE", "JIECEP", "LISSA", "PICE", "SOURCE", "UAPSA"];
    const CTE_ABO = ["ECC", "GENTLE", "GEM-O", "LapitBayan", "LME", "SPEM", "SSS"];
    const CTHM_ABO = ["FHARO", "FTL", "SOTE"];

    const CAS_College = ["CAS"];
    const CBA_College = ["CBA"];
    const CCSEA_College = ["CCSEA"];
    const CTE_College = ["CTE"];
    const CTHM_College = ["CTHM"];

    const {
        isSAO,
        isUSGorSAO,
        isCollegeOrSAO,
    } = isMainOrgs(organization, departmentName);

    const {
        isCSOorSAO,
        isCSOorIBOorSAO,
        isExtraOrgsTrue
    } = isExtraOrgs(organization);

    const isCAS = CAS_ABO.includes(organization) || isCSOorSAO;
    const isCBA = CBA_ABO.includes(organization) || isCSOorSAO;
    const isCCSEA = CCSEA_ABO.includes(organization) || isCSOorSAO;
    const isCTE = CTE_ABO.includes(organization) || isCSOorSAO;
    const isCTHM = CTHM_ABO.includes(organization) || isCSOorSAO;

    const isCASCollege = CAS_College.includes(organization) || isSAO;
    const isCBACollege = CBA_College.includes(organization) || isSAO;
    const isCCSEACollege = CCSEA_College.includes(organization) || isSAO;
    const isCTECollege = CTE_College.includes(organization) || isSAO;
    const isCTHMCollege = CTHM_College.includes(organization) || isSAO;

    const isCollegeOrSAORegister = isCASCollege || isCBACollege || isCCSEACollege || isCTECollege || isCTHMCollege || isSAO;

    res.render('register', {
        adminData,
        departmentName,
        isSAO,
        isUSGorSAO,
        isCollegeOrSAO,
        isCSOorSAO,
        isCSOorIBOorSAO,
        isExtraOrgsTrue,
        organization,
        isCAS,
        isCBA,
        isCCSEA,
        isCTE,
        isCTHM,
        isCollegeOrSAORegister,
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
    const aboName = req.session.aboName;
    const iboName = req.session.iboName;
    const eventData = req.session.eventData;

    const {
        isAdminURL,
        isStudentURL,
        isRecordPage
    } = getUrlFlags(req.url);

    db.query('SELECT * FROM event', (error, events) => {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            const institutionalEvents = events.filter(event => event.event_scope === 'INSTITUTIONAL');
            const collegeEvents = events.filter(event => event.event_scope === departmentName);
            const aboEvents = events.filter(event => event.event_scope === aboName);
            const iboEvents = events.filter(event => event.event_scope === iboName);

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
                            aboEvents,
                            iboEvents,
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
});

router.get('/dashboard', (req, res) => {
    if (req.session.isAuthenticated) {
        const adminData = req.session.adminData;
        const studentData = req.session.studentData;
        const organization = adminData.organization;
        const { isUSGorSAO } = isMainOrgs(organization);
        const { isExtraOrgsTrue } = isExtraOrgs(organization);

        res.render('dashboard', {
            adminData,
            isUSGorSAO,
            isExtraOrgsTrue,
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
        const organization = adminData.organization;
        const { isUSGorSAO } = isMainOrgs(organization);
        const { isExtraOrgsTrue } = isExtraOrgs(organization);

        let errorMessage = '';

        if (req.session.errorMessage) {
            errorMessage = req.session.errorMessage;
            delete req.session.errorMessage;
        }

        res.render('dashboard-add-student', {
            adminData,
            isUSGorSAO,
            isExtraOrgsTrue,
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
        const organization = adminData.organization;
        const departmentName = req.session.departmentName;
        const aboName = req.session.aboName;
        const iboName = req.session.iboName;
        const eventData = req.session.eventData;

        const {
            isUSG,
            isSAO,
            isCollege,
            isUSGorSAO,
            isCollegeOrSAO,
            isMainOrgsTrue
        } = isMainOrgs(organization, departmentName);

        const {
            ABO,
            IBO,
            isCSO,
            isABO,
            isIBO,
            isABOorIBO,
            isCSOorABO,
            isCSOorIBO,
            isCSOorSAO,
            isABOorSAO,
            isIBOorSAO,
            isCSOorABOorSAO,
            isCSOorIBOorSAO,
            isExtraOrgsTrue
        } = isExtraOrgs(organization);

        const {
            isAdminURL,
            isStudentURL,
            isEditURL,
            isRecordPage,
            isAdminPageURL
        } = getUrlFlags(req.url);

        db.query('SELECT * FROM event', (error, events) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard');
            } else {
                const institutionalEvents = events.filter(event => event.event_scope === 'INSTITUTIONAL');
                const collegeEvents = events.filter(event => event.event_scope === departmentName);
                const aboEvents = events.filter(event => event.event_scope === aboName);
                const iboEvents = events.filter(event => event.event_scope === iboName);

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
                                isUSG,
                                isSAO,
                                isCollege,
                                isUSGorSAO,
                                isCollegeOrSAO,
                                isMainOrgsTrue,
                                ABO,
                                IBO,
                                isCSO,
                                isABO,
                                isIBO,
                                isABOorIBO,
                                isCSOorABO,
                                isCSOorIBO,
                                isCSOorSAO,
                                isABOorSAO,
                                isIBOorSAO,
                                isCSOorABOorSAO,
                                isCSOorIBOorSAO,
                                isExtraOrgsTrue,
                                isAdminURL,
                                isEditURL,
                                isAdminPageURL,
                                isStudentURL,
                                isRecordPage,
                                eventData,
                                institutionalEvents,
                                collegeEvents,
                                aboEvents,
                                iboEvents,
                                idNumber: idNumber,
                                events: events.map(event => ({
                                    ...event,
                                    formattedStartDate: event.event_date_start.toLocaleDateString(),
                                    formattedEndDate: event.event_date_end.toLocaleDateString(),
                                })),
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
        const organization = adminData.organization;
        const departmentName = req.session.departmentName;
        const aboName = req.session.aboName;
        const iboName = req.session.iboName;
        const eventData = req.session.eventData;

        const {
            isUSG,
            isSAO,
            isCollege,
            isUSGorCollege,
            isUSGorSAO,
            isCollegeOrSAO,
            isMainOrgsTrue
        } = isMainOrgs(organization, departmentName);

        const {
            ABO,
            IBO,
            isCSO,
            isABO,
            isIBO,
            isABOorIBO,
            isCSOorABO,
            isCSOorIBO,
            isCSOorSAO,
            isABOorSAO,
            isIBOorSAO,
            isCSOorABOorSAO,
            isCSOorIBOorSAO,
            isExtraOrgsTrue
        } = isExtraOrgs(organization);

        const {
            isAdminURL,
            isStudentURL,
            isEditURL,
            isRecordPage,
            isAdminPageURL
        } = getUrlFlags(req.url);

        db.query('SELECT * FROM event', (error, events) => {
            if (error) {
                console.log(error);
                res.redirect('/dashboard');
            } else {
                const institutionalEvents = events.filter(event => event.event_scope === 'INSTITUTIONAL');
                const collegeEvents = events.filter(event => event.event_scope === departmentName);
                const aboEvents = events.filter(event => event.event_scope === aboName);
                const iboEvents = events.filter(event => event.event_scope === iboName);

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
                                isUSG,
                                isSAO,
                                isCollege,
                                isUSGorCollege,
                                isUSGorSAO,
                                isCollegeOrSAO,
                                isMainOrgsTrue,
                                ABO,
                                IBO,
                                isCSO,
                                isABO,
                                isIBO,
                                isABOorIBO,
                                isCSOorABO,
                                isCSOorIBO,
                                isCSOorSAO,
                                isABOorSAO,
                                isIBOorSAO,
                                isCSOorABOorSAO,
                                isCSOorIBOorSAO,
                                isExtraOrgsTrue,
                                isAdminURL,
                                isEditURL,
                                isAdminPageURL,
                                isStudentURL,
                                isRecordPage,
                                eventData,
                                institutionalEvents,
                                collegeEvents,
                                aboEvents,
                                iboEvents,
                                events: events.map(event => ({
                                    ...event,
                                    formattedStartDate: event.event_date_start.toLocaleDateString(),
                                    formattedEndDate: event.event_date_end.toLocaleDateString(),
                                })),
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