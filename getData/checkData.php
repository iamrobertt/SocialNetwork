<?php
require('../inc/query.php');
error_reporting(0);
$conn = connectToDatabase();

if($_POST['emailRegistrazione']){
    $emailRegistrazione = $_POST['emailRegistrazione'];
    $resContrEmail = queryCheckEmailReg($conn, $emailRegistrazione);
    
    if(mysqli_num_rows($resContrEmail) > 0)$esisteEmail = true;
    else $esisteEmail = false;

    $arr = array("esisteEmail" => $esisteEmail);
    echo json_encode($arr);
}

if($_POST['telefonoRegistrazione']){
    $telefonoRegistrazione = $_POST['telefonoRegistrazione'];
    $resContrTelefono = queryCheckPhone($conn, $telefonoRegistrazione);

    if(mysqli_num_rows($resContrTelefono) > 0)$esisteTelefono = true;
    else $esisteTelefono = false;

    $arr = array("esisteTelefono" => $esisteTelefono);
    echo json_encode($arr);
}

if($_POST['usernameProfilo']){
    $usernameProfilo = $_POST['usernameProfilo'];
    $resContrUsername = queryCheckUsername($conn, $usernameProfilo);
    
    if(mysqli_num_rows($resContrUsername) > 0)$esisteUsername = true;
    else $esisteUsername = false;

    $arr = array("esisteUsername" => $esisteUsername);
    echo json_encode($arr);
}
?>