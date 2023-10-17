<?php
session_start();

if (isset($_GET['error']) && $_GET['error'] === 'true') {
    $error_message = "Incorrect username or password. Please try again.";
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/softeng code/img/lsu.ico" type="image/x-icon">
        <link rel="shortcut icon" href="/softeng code/img/lsu.ico" type="image/x-icon">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/welcome.css">

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
        <img src="/softeng code/img/image 6.png" alt="" class="login-bg">
        <div class="row">
            <div class="column">
                <img src="/softeng code/img/lsu.png" alt="LSU Logo" class="img-logo-landing">
            </div>
            <div class="column">
                <a href="help.html">
                    <img src="/softeng code/img/Question_fill.png" alt="Help and Resources" class="img-help">
                </a>
            </div>
        </div>
        
        <div class="flex-container login-space">
            <div class="folder-bottom-above"></div>
            <div class="searchspace login-form">
                <h2>LOGIN</h2>
                
            </div>
            <form method="POST" action="login-process.php" class="folder-bottom-login">
                <div class="form-group">
                <?php if (isset($_GET['error'])) { ?>
                    <p class="error"><?php echo $_GET['error']; ?></p>
                <?php } ?>

                    <input type="text" id="username" name="username" class="form-control" placeholder="USERNAME" required>
                </div>
                <div class="form-group password-form">
                    <input type="password" id="password" name="password" class="form-control" placeholder="PASSWORD"required>
                    <i class="far fa-eye" id="togglePassword" onclick="togglePasswordVisibility()"></i>
                </div>
                <button type="submit" id="login-login-button">
                LOGIN
                </button>
            </form>
        </div>
    </header>
    <script src="/softeng code/js/script.js"></script>
</body>
</html>