<?php 
error_reporting(0);
session_start();
//Faccio la require del file di connessione al database
require("./inc/query.php");
$conn = connectToDatabase();

$displaySearchBox = false;
//query per far rimanere la foto della navbar dell'utente loggato e non di quello cercato
$usernameSessione = $_SESSION['username'];
//se viene fatta una get allora lo username darà quello cercato e i dati stampati pure
//altrimenti significa che l'utente ha richiesto a visualizzazione del suo profilo
if($_GET['username']) $username = $_GET['username'];
else $username = $_SESSION['username'];

$tipoAccount = queryGetAccountType($conn, $username);
$getTypeFollow = queryGetTypeFOllow($conn, $usernameSessione, $username);
//query per dati del profilo
$resQueryProfilo = queryProfilo($conn, $username);
while($row = mysqli_fetch_assoc($resQueryProfilo)){
    $biografia = $row['Biografia'];
    $pathFotoProfilo = $row['Immagine_Profilo'];
}

//query per la foto della navbar, quella per accedere poi a delle opzioni per l'account
$pathFotoNavBar = queryFotoProfilo($conn, $usernameSessione);

//query che conta il numero di post per poi mettere la primary key dinamicamente nel php
$countPost = queryContPostUser($conn, $username);

//query che conta il numero dei follower della persona
$contUserFollower = queryContFollowerUser($conn, $username);

//query che conta il numero dei seguaci della persona
$contUserFollowing = queryContFollowing($conn, $username);

//query che serve per vedere se due utenti si seguono già, nel caso appariranno diverse opzioni
$checkFollow = queryCheckFollow($conn, $usernameSessione, $username);

$typeAccount = queryGetAccountType($conn, $username);

if($_POST['logout']){
    session_unset();
    session_destroy();
}

if($_POST['utenteSeguito']){
        
    $date = date('Y/m/d');
    str_replace('/', '-', $date);
    $utenteSeguito = $_POST['utenteSeguito'];
    $utenteSegue = $usernameSessione;
    if($tipoAccount == 0) queryInsertFollow($conn, $date, $utenteSegue, $utenteSeguito, 0);
    else queryInsertFollow($conn, $date, $utenteSegue, $utenteSeguito, 1);
}

if($_POST['utenteDelete']){
    $utenteSeguito = $_POST['utenteDelete'];
    $utenteSegue = $usernameSessione;
    queryDeleteFollow($conn, $utenteSeguito, $utenteSegue);
}

if($_POST['commento']){

    $commento = $_POST['commento'];
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
    <title>Profile</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/styleProfile.css">
    <link rel="stylesheet" href="css/styleNavBar.css">
</head>

<body>
<script>
    let typeAccount = "<?php echo $typeAccount; ?>";
    let typeFollow = "<?php if($getTypeFollow != NULL) echo $getTypeFollow; else echo "null" ?>";
</script>
<?php 
    if($_SESSION['logged']) {
        require("./inc/navbar.php");
?>
    
    <div class="dettagliProfilo">
        <div class="fotoProfiloBox">
            <img class="fotoProfiloProfile" src="./profileImages/<?php echo $pathFotoProfilo?>" alt="">
        </div>
        <section class="dataProfilo">
            <h1><?php echo $username ?></h1>
            <div class="followposts">
                <div class="postsCount">    
                    <span class="spanText">POSTS</span><br>
                    <span><?php echo $countPost; ?></span>
                </div>
                <div class="followers">        
                    <span class="spanText">FOLLOWERS</span><br>
                    <span><?php echo $contUserFollower; ?></span>
                </div>
                <div class="following">
                    <span class="spanText">FOLLOWING</span><br>
                    <span><?php echo $contUserFollowing; ?></span>
                </div>
            </div>
            <div class="biografiaBox">
                    <div class="biografiaProfilo"><?php echo $biografia; ?></div>
            </div>

            <div class="followModify">
                
<?php                     if($username == $_SESSION['username']){
?>
                        <button class="modificaProfilo">Modifica Profilo</button>
                    
<?php
                    }
                    else if($username != $_SESSION['username'] && $checkFollow && $getTypeFollow == 0){
?>
                        <button class="unFollowBtn">Non seguire più</button>
<?php
                    }
                    else if($username != $_SESSION['username'] && !$checkFollow && $tipoAccount == 0){
?>
                        <button class="FollowBtn">Segui</button>
<?php
                    } 
                    else if($username != $_SESSION['username'] && !$checkFollow && $tipoAccount == 1){
?>
                        <button class="FollowBtn">Invia Richiesta</button>
<?php
                    }
                    else if($username != $_SESSION['username'] && $checkFollow && $getTypeFollow == 1){
?>
                        <button class="unFollowBtn">Richiesta Inviata</button>
<?php
                    }
?>

                
            </div>
        </section>
    <hr class="hr-profilo">
    </div>
    <section>
        <div class="postsProfile">
            <div class="postsProfileInner">
            </div>
        </div>
    </section>
    
    <section>
        <div id="modalPost" class="modalPost">
            <div class="modalPostBody">
            </div>
        </div>
    </section>
    <div class="overlay"></div>

<?php }
    else header("Location: index.php");
?>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="./javascript/controlsProfile.js"></script>
    <script src="./javascript/controlsNavBar.js"></script>
</body>
</html>