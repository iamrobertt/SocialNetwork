<?php 
session_start();
error_reporting(0);
require("../inc/query.php");
$conn = connectToDatabase();

if($_POST['getPostData']){

    $src = $_POST['getPostData'];

    $resQueryModalPost = queryModalPost($conn, $src);
    $arrayDataPost = array();

    while($row = mysqli_fetch_assoc($resQueryModalPost)){
        $data_post =  date("F j, Y, g:i a", strtotime($row['Data_Post']));
        $username_post = $row['Username'];
        $descrizione_post = $row['Descrizione'];
    }

    $foto_profilo = queryFotoProfilo($conn, $username_post);

    array_push($arrayDataPost, array('data_post' => $data_post, 'username_post' => $username_post, 'descrizione_post' => $descrizione_post, 'src' => $src, 'foto_profilo' => $foto_profilo));
    echo json_encode($arrayDataPost);
}

if($_POST['getCommenti']){

    $src = $_POST['getCommenti'];
    $id_post = queryGetIDPost($conn, $src);
    
    $resCommenti = queryGetCommenti($conn, $id_post);
    $arrayCommenti = array();

    while($row = mysqli_fetch_assoc($resCommenti)){

        $data_commento = date("F j, Y, g:i a", strtotime($row['DataCommento']));
        $username_commento = $row['Username'];
        $descrizioneCommento = $row['Descrizione_Commento'];
        $foto_profilo = queryFotoProfilo($conn, $username_commento);

        array_unshift($arrayCommenti, array('data_commento' => $data_commento, 'username_commento' => $username_commento, 'descrizione_commento' => $descrizioneCommento, 'foto_profilo' => $foto_profilo));
    }

    echo json_encode($arrayCommenti);
}

if($_POST['getLike']){

    $src = $_POST['getLike'];
    $id_post = queryGetIDPost($conn, $src);
    $like_post = queryContLikePost($conn, $id_post);
    $arrayLikePost = array();
    $check_like = queryCheckLikePost($conn, $id_post, $_SESSION['username']);
    
    array_push($arrayLikePost, array('like_post' => $like_post, 'check_like_post' => $check_like));
    echo json_encode($arrayLikePost);
}

if($_POST['getNumCommenti']){
    $src = $_POST['getNumCommenti'];
    $id_post = queryGetIDPost($conn, $src);
    $contCommenti = queryContComments($conn, $id_post);
    $contCommentiArray = array();

    array_push($contCommentiArray, array('cont_commenti' => $contCommenti));
    echo json_encode($contCommentiArray);
}

?>