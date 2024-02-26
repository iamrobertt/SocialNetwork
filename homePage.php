<?php
error_reporting(0);
session_start();
//Faccio la require del file di connessione al database
require("./inc/query.php");
$conn = connectToDatabase();

$displaySearchBox = true;
$usernameSessione = $_SESSION['username'];
$pathFotoNavBar = queryFotoProfilo($conn, $usernameSessione);

if ($_POST['logout']) {
    session_unset();
    session_destroy();
}

if($_POST['commento']){

    $commento = $_POST['commento'];
    $commento = filter_var($commento, FILTER_SANITIZE_STRING);

    $src = $_POST['src'];

    $id_post = queryGetIDPost($conn, $src);
    $dataCommento = str_replace("/", "-", date('Y/m/d'));
    //da modificare anche questa parte, non so bene come fare.
    //se viene trovata una buona soluzione deve essere usata in egual modo anche per i post poichè
    //condividono lo stesso problema
    $totalCommenti = queryContTotComments($conn);
    $totalCommenti = $totalCommenti + 1;
    if($totalCommenti <= 9) $totalCommenti = "0" . $totalCommenti;

    $id_commento = "C" . $totalCommenti;

    queryInsertCommento($conn, $id_commento, $commento, $usernameSessione, $id_post, $dataCommento);
}

if($_POST['like']){
    $src = $_POST['like'];
    $id_post = queryGetIDPost($conn, $src);
    $dataLike = str_replace("/", "-", date('Y/m/d'));
    
    queryInsertLike($conn, $dataLike, $usernameSessione, $id_post);
}

if($_POST['deleteLike']){

    $src = $_POST['deleteLike'];
    $id_post = queryGetIDPost($conn, $src);

    $queryDelLikePost = queryDelLikePost($conn, $id_post, $_SESSION['username']);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>

    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/styleHomePage.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/styleNavBar.css">
</head>

<body>

    <?php
    if ($_SESSION['logged']) {
        require("./inc/navbar.php");
    ?>

        <div class="mainContainer">
            <div class="chatBox">
                <p>Direct presto in arrivo!</p>
                <div class="chatBoxInner">
                </div>
            </div>

            <div class="feedBox">
                <div class="feedBoxInner">
                </div>
            </div>
            <div class="searchUsersBox">
                <p>Qui troverai i risultati delle tue ricerche.</p>
                <div class="searchUsersBoxInner">
                </div>
            </div>

        </div>

        <div class="footer">
            <p>Copiright 2022 - Paki&Rom</p>
        </div>

        <section>
            <!--SCHERMATA SOVRIMPRESSIONE DEL POST CON I SUOI RELATIVI DATI -->
            <div id="modalPost" class="modalPost">
                <div class="modalPostBody">
                </div>
            </div>
        </section>
        <div class="overlay"></div>

    <?php
    } else header("Location: index.php");
    ?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="./javascript/controlsHomePage.js"></script>
    <script src="./javascript/controlsNavBar.js"></script>
</body>

</html>