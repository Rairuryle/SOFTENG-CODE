<?php 
session_start();

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="img/lsu.ico" type="image/x-icon">
        <link rel="shortcut icon" href="img/lsu.ico" type="image/x-icon">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/dashboard.css">
        
        <title>LSU Events and Attendance Tracking Website</title>
        <script>
            if (window.history && window.history.pushState) {
                window.history.pushState(null, null, window.location.href);
                window.onpopstate = function(event) {
                    window.history.pushState(null, null, window.location.href);
                };
            }
        </script>

    </head>
<body>
    <header>
        <div class="row">
            <div class="column">
                <img src="img/lsu.png" alt="LSU Logo" class="img-logo-landing">
            </div>
            <div class="column">
                <a href="help.html"><img src="img/Question_fill.png" alt="Help and Resources" class="img-help"></a>
            </div>
        </div>
        <div class="dashboard-title">
            <h2>DASHBOARD</h2>
        </div>
    </header>
    <div class="container-main-dashboard">
        <nav>
            <div class="dashboard-nav">
                <div class="flex-container dashboard-nav-container">
                    <div class="flex-container img-participation-record-nav">
                        <a href="university-events-admin.html">
                            <img src="img/Folder.png" alt="Participation Record Nav Icon">
                        </a>
                    </div>
                    <a href="university-events-admin.html">Participation Record</a>
                </div>
                <hr>
                <div class="flex-container dashboard-nav-container main-icons-container">
                    <div class="flex-container img-add-student-nav main-nav-icons">
                        <a href="dashboard-add-student.html">
                            <img src="img/User_cicrle.png" alt="Add Student Account Nav Icon">
                        </a>
                    </div>
                    <a href="dashboard-add-student.html">ADD STUDENT</a>
                </div>
                <div class="flex-container dashboard-nav-container main-icons-container">
                    <div class="flex-container img-archives-nav main-nav-icons">
                        <img src="img/Arhive_alt_small.png" alt="Archives Nav Icon">
                    </div>
                    <a href="#">ARCHIVES</a>
                </div>

                <div class="container container-widget">
                    <div class="holder holder-widget">
                        <div class="icon icon-widget">
                            <a href="login.html">
                                <img src="img/On_button.png" alt="Log Out Icon">
                            </a>
                        </div>
                        <div class="text text-widget text-widget-logout">
                            <a href="login.html" class="link-widget">LOG OUT</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <article>
            <div class="container-dashboard">
                <div class="flex-container holder-dashboard">
                    <div class="flex-container container-dashboard-message">
                        <div class="flex-container img-message-dashboard">
                            <img src="img/Star 2.png" alt="La Salle Star">
                        </div>
                        <h2>Welcome to the Dashboard!</h2>
                    </div>
                </div>
            </div>
        </article>
    </div>
</body>
</html>