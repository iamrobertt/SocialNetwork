<?php 

error_reporting(0);
session_start();

//Faccio la require del file di connessione al database
require("./inc/query.php");
$conn = connectToDatabase();

//query che mi restituisce email e nome dell'immagine profilo per poter farli visualizzare nella pagina
$displaySearchBox = false;
$usernameSessione = $_SESSION['username'];
$pathFotoNavBar = queryFotoProfilo($conn, $usernameSessione);
$email = queryGetEmail($conn, $usernameSessione);

if($_POST['logout']){
    session_unset();
    session_destroy();
}

function insertFile($_email){
    $target_dir = "postImages/";
    $file = $_FILES['fotoCreaPost']['name'];

    $path = pathinfo($file);
    $filename = $path['filename'];
    $ext = $path['extension'];

    //unisco nome del file e email dell'utente per rendere la foto sicuramente univoca
    $fileMergeName = $filename . $_email;
    $fileMergeName .= rand(11111, 99999);
    $finalName = md5($fileMergeName). "." . $ext;

    //ultimi paddaggi per poter inserire il file correttamente
    $temp_name = $_FILES['fotoCreaPost']['tmp_name'];
    $path_filename_ext = $target_dir.$finalName;

    //$finalPath = $_SERVER['DOCUMENT_ROOT']."/".$path_filename_ext;

    //inserimento del file nella cartella e assegno il nome del file alla variabile di sessione per poter inserire tutto alla fine
    $_SESSION['nomeFotoCreaPost'] = $finalName;
    $checkMoved = move_uploaded_file($temp_name, $path_filename_ext);
}
if(isset($_FILES['fotoCreaPost'])){
    insertFile($email);
}

if(isset($_POST['descrizioneCreaPost'])){

    $descrizioneCreaPost = $_POST['descrizioneCreaPost'];
    $dateTime = date('Y/m/d H:i');
    $finalName = $_SESSION['nomeFotoCreaPost'];
    
    //query che conta il numero dei post totali per poter creare un id post univoco ogni volta
    $totalPosts = queryContTotPost($conn);

    if($totalPosts <= 9) $totalPosts = "0" . $totalPosts;

    $id_post = "P" . $totalPosts;
    //query cehe inserisce i dati del postnel database
    queryInsertPost($conn, $id_post, $dateTime, $usernameSessione, $finalName, $descrizioneCreaPost);
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Post</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/styleCreaPost.css">
    <link rel="stylesheet" href="css/styleNavBar.css">
</head>
<body>
<?php 
    if($_SESSION['logged']){
        include("./inc/navbar.php");
?>

    <div class="containerCreatePost">
        <div class="innerContainerPost">
            <h1>Puoi creare il tuo post qui, <?php echo $usernameSessione; ?>!</h1>
            <h2>Premi la fotto sottostante e scegli un'immagine!</h2>
            <div class="fotoPostImgBox">
                <img class="fotoPostImg" src="./assets/immagine_default.png" alt="">
            </div>

            <div class="descrizioneCreaPostBox">
                <textarea class="descrizioneCreaPost" rows="3" placeholder="Inserisci la descrizione del tuo post, se vuoi."></textarea>
            </div>

            <button style="margin-bottom: 5%;" class="submit_new_post" type="submit">Crea Post</button>

        </div>
    </div>
<?php 
    }
    else{
        header("Location: ./index.php");
    }
?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="./javascript/controlsCreatePost.js"></script>
    <script src="./javascript/controlsNavBar.js"></script>
</body>
</html>