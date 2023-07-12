<?php
session_start();
require('../inc/query.php');
$conn = connectToDatabase();
//bisogna modificare query perche prende i miei post e non quello dell'utente seguito
$usernameProfilo = $_SESSION['username'];
$resQueryFeed = queryFeed($conn, $usernameProfilo);
$arrayFeedPosts = array();

while($row = mysqli_fetch_assoc($resQueryFeed)) {

    $utenteSeguitoFeed = $row['Username_Seguito'];
    $pathFotoProfilo = $row['Immagine_Profilo'];
    $dataPostFeed = date("F j, Y, g:i a", strtotime($row['Data_Post']));
    $pathFotoFeed = $row['Foto_Post'];
    $descrizioneFeed = $row['Descrizione'];

    $id_post = queryGetIDPost($conn, $pathFotoFeed);
    $contLike = queryContLike($conn, $id_post);
    $contCommenti = queryContComments($conn, $id_post);

    array_push($arrayFeedPosts, array('usernameSeguito' => $utenteSeguitoFeed, 'pathFotoProfilo' => $pathFotoProfilo, 'dataPostFeed' => $dataPostFeed, 'pathFotoFeed'=> $pathFotoFeed, 'descrizioneFeed' => $descrizioneFeed, 'contLikeFeed' => $contLike, 'contCommentiFeed' => $contCommenti));
}

echo json_encode($arrayFeedPosts);
?>  