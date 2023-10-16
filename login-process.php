<?php 
session_start(); 
include "connect.php";

if (isset($_POST['username']) && isset($_POST['password'])) {

	function validate($data){
       $data = trim($data);
	   $data = stripslashes($data);
	   $data = htmlspecialchars($data);
	   return $data;
	}

	$uname = validate($_POST['username']);
	$pass = validate($_POST['password']);

	if (empty($uname)) {
		header("Location: login.php?error=Username is required");
	    exit();
	}else if(empty($pass)){
        header("Location: login.php?error=Password is required");
	    exit();
	}else{
		$sql = "SELECT * FROM admin WHERE Username='$uname' AND Password='$pass'";

		$result = mysqli_query($conn, $sql);

		if (mysqli_num_rows($result) === 1) {
			$row = mysqli_fetch_assoc($result);
            if ($row['Username'] === $uname && $row['Password'] === $pass) {
            	$_SESSION['Username'] = $row['Username'];
            	$_SESSION['AdminID'] = $row['AdminID'];
            	header("Location: dashboard.php");
		        exit();
            }else{
				header("Location: login.php?error=Incorect username or password");
		        exit();
			}
		}else{
			header("Location: login.php?error=Incorect username or password");
	        exit();
		}
	}
	
}else{
	header("Location: login.php");
	exit();
}