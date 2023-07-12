<?php 
session_start();

if($_POST['emailEmail']){
    $email = $_POST['emailEmail'];
    $token = $_SESSION['token'];
    $msgMail = "https://necular.altervista.org/SocialNetwork/verifyEmail.php?key=".$email. "&token=" .$token. "";
    echo $msgMail;
}
?>