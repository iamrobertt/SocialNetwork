<?php
error_reporting(0);
session_start();
require('../inc/query.php');
$conn = connectToDatabase();

if($_POST['postsUtente']){
    if($_POST['postsUtente'] == "localUser") $usernamePosts = $_SESSION['username'];
    else $usernamePosts = $_POST['postsUtente'];

    $resQueryStampaPosts = queryStampaPost($conn, $usernamePosts);
    $arrayPosts= array();

    while($row = mysqli_fetch_assoc($resQueryStampaPosts)){
        $dateTime = $row['Data_Post'];
        $pathFotoPost = $row['Foto_Post'];
        $descrizionePost = $row['Descrizione'];

        array_unshift($arrayPosts, array('dateTimePost' => $dateTime, 'pathFotoPost' => $pathFotoPost, 'descrizionePost' => $descrizionePost));
    }
    echo json_encode($arrayPosts);
}
?>