<?php
session_start();

//file che si occuperà di prendere (per ora) le richieste per seguire account privati e di mostrarle come notifiche
require("../inc/query.php");
$conn = connectToDatabase();

if($_POST['getNotifications']){

    $username = $_SESSION['username'];
    $resQueryGetPendingRequests = queryGetPendingRequests($conn, $username);
    $arrayPendingRequests = array();
    while($row = mysqli_fetch_assoc($resQueryGetPendingRequests)){
        $usernameSegue = $row['Username_Segue'];
        $msg = "Richiesta di follow da parte di ".$usernameSegue.".";
        $pathFotoProfilo = queryFotoProfilo($conn, $usernameSegue);
        array_unshift($arrayPendingRequests, array('username_segue' => $usernameSegue, 'msg' => $msg, 'foto_profilo' => $pathFotoProfilo));
    }

    echo json_encode($arrayPendingRequests);

}

if($_POST['getNumNotifications']){
    $contNotifications = mysqli_num_rows(queryGetPendingRequests($conn, $_SESSION['username']));
    $contNotificationsArray = array();
    array_unshift($contNotificationsArray, array('contNotifications' => $contNotifications));
    echo json_encode($contNotificationsArray);
}

if($_POST['aggiornaFollowSospeso']){
    $username = $_SESSION['username'];
    $usernameSegue = $_POST['aggiornaFollowSospeso'];

    updatePendingFollow($conn, $username, $usernameSegue);
}

if($_POST['cancellaFollowSospeso']){
    $username = $_SESSION['username'];
    $usernameSegue = $_POST['cancellaFollowSospeso'];
    queryDeleteFollow($conn, $username, $usernameSegue);
}

?>