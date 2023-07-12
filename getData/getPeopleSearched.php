<?php
session_start();
error_reporting(0);
require('../inc/query.php');
$conn = connectToDatabase();

if($_POST['personaDaCercare']){
    $usernameDaCercare = $_POST['personaDaCercare'];
    $resQueryCercaUtente = querySearchUser($conn, $usernameDaCercare);
    $arrayUsers= array();
    while($row = mysqli_fetch_assoc($resQueryCercaUtente)){
        $usernameCercato = $row['Username'];
        $pathFotoProfiloCercato = $row['Immagine_Profilo'];
        $biografiaCercata = $row['Biografia'];

        //se si cerca un utente e si trova anche l'utente stesso che cerca, non stampare il suo profilo
        if($_SESSION['username'] != $usernameCercato) array_push($arrayUsers, array('username' => $usernameCercato, 'pathFotoProfilo' => $pathFotoProfiloCercato, 'biografia' => $biografiaCercata));
    }

    echo json_encode($arrayUsers);
} 
?>