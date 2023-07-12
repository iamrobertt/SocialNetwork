<?php
session_start();
error_reporting(0);

require("./inc/query.php");
$conn = connectToDatabase();

//per convertire da numero a mesi (penso che cambiero la data dalle select all'input type data)
$mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
// //query che mi restituisce email e nome dell'immagine profilo per poter farli visualizzare nella pagina
$displaySearchBox = false;
$usernameSessione = $_SESSION['username'];
$pathFotoNavBar = queryFotoProfilo($conn, $usernameSessione);
$tipoAccount = queryGetAccountType($conn, $usernameSessione);

//prendo tutti i dati dell'utente
$resQueryGetDataUser = queryGetDataUSer($conn, $usernameSessione);
while($row = mysqli_fetch_assoc($resQueryGetDataUser)){
    $email = $row['Email'];
    $password = $row['Password'];
    $nome = $row['Nome'];
    $cognome = $row['Cognome'];
    $immagineProfilo = $row['Immagine_Profilo'];
    $dataNascita = $row['DataNascita'];
    $giornoNascita = explode("-", $dataNascita)[2];
    $meseNascita = explode("-", $dataNascita)[1];
    $annoNascita = explode("-", $dataNascita)[0];
    $biografia = $row['Biografia'];
    $genere = $row['Genere'];
    $telefono = $row['Telefono'];

    if($genere == "M") $genereStr = "Maschio";
    else if($genere == "F") $genereStr = "Femmina";
    else $genereStr = "Preferisco non specificare";
}

if(isset($_FILES['fotoProfilo'])){
     //directory dove andrà il file
     $target_dir = "profileImages/";

     //dettagli del file inserito
     $file = $_FILES['fotoProfilo']['name'];
     $path = pathinfo($file);
     $filename = $path['filename'];
     $ext = $path['extension'];
 
     //unisco nome del file e email dell'utente per rendere la foto sicuramente univoca
     $fileMergeName = $filename . $email;
     $finalName = md5($fileMergeName). "." . $ext;
 
     //ultimi paddaggi per poter inserire il file correttamente
     $temp_name = $_FILES['fotoProfilo']['tmp_name'];
     $path_filename_ext = $target_dir.$finalName;
 
     //$finalPath = $_SERVER['DOCUMENT_ROOT']."/".$path_filename_ext;
     $_SESSION['pathFotoProfilo'] = $finalName;
     if(file_exists("profileImages/" .$pathFotoNavBar) && $pathFotoNavBar != "default_user_icon.png") unlink("profileImages/" .$pathFotoNavBar);
     //inserimento del file nella cartella e assegno il nome del file alla variabile di sessione per poter inserire tutto alla fine
     $checkMoved = move_uploaded_file($temp_name, $path_filename_ext);
}

if($_POST['noFotoProfilo']) $_SESSION['pathFotoProfilo'] = $pathFotoNavBar;

if($_POST['email']){
    $prevUsername = $_POST['prevUsername'];
    $nuovoUsername = $_POST['username'];
    
    if($prevUsername == $nuovoUsername) $nuovoUsername = $prevUsername;
    else $nuovoUsername = $_POST['username'];

    $email = $_POST['email'];
    $passwordNuova = $_POST['passwordNuovaPassword'];
    $passwordPrecedente = $_POST['passwordPrecedente'];
    $biografia = $_POST['biografia'];
    $pathFotoProfilo = $_SESSION['pathFotoProfilo'];

    if($passwordNuova == "") $passwordNuova = $password;
    if((md5($passwordPrecedente) == $password && $passwordNuova != "")) $passwordNuova = md5($_POST['passwordNuovaPassword']);
    
    if((md5($passwordPrecedente) == $password && $passwordNuova != "") || $passwordNuova == $password){
        $queryModUser = "UPDATE Utente SET Username = \"$nuovoUsername\", Email = \"$email\", Password = \"$passwordNuova\", Immagine_Profilo = \"$pathFotoProfilo\", Biografia = \"$biografia\" WHERE Username = \"$prevUsername\"";
        $resQueryModUser = mysqli_query($conn, $queryModUser);

        if(mysqli_affected_rows($conn) == 1) $_SESSION['username'] = $nuovoUsername;
        //unica query che non sembra funzionare
        //$resQueryModUSer = queryModUSer($conn, $prevUsername, $nuovoUsername, $email, $passwordNuova, $nome, $conn, $nuovaData, $genere, $pathFotoProfilo, $telefono, $biografia);
    }
}

if($_POST['prevUsername2']){
    
    $nome = $_POST['nome'];
    $cognome = $_POST['cognome'];
    $telefono = $_POST['telefono'];
    $genere = $_POST['genereRegistrazione'];
    $nuovaData = $_POST['nuovaData'];
    $passwordPrecedente = $_POST['passwordPrecedente'];
    $prevUsername = $_POST['prevUsername2'];

    if(md5($passwordPrecedente) == $password ){
        echo "password corretta";
        $qqueryModUser = "UPDATE Utente SET Nome = \"$nome\", Cognome = \"$cognome\", DataNascita = \"$nuovaData\", Genere = \"$genere\", Telefono = \"$telefono\" WHERE Username = \"$prevUsername\"";
        mysqli_query($conn, $qqueryModUser);
        //$resQueryModUSer = queryModUSer($conn, $prevUsername, $nuovoUsername, $email, $passwordNuova, $nome, $conn, $nuovaData, $genere, $pathFotoProfilo, $telefono, $biografia);
    }
}

if($_POST['AccountPrivato']){
    $isPrivate = $_POST['AccountPrivato'];

    if($isPrivate == "true") $isPrivate = 1;
    else $isPrivate = 0;

    queryChangeAccountType($conn, $isPrivate, $usernameSessione);
}

if($_POST['logout']){
    session_unset();
    session_destroy();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/styleSettingsPrivacy.css">
    <link rel="stylesheet" href="css/styleNavBar.css">
</head>
<body>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <?php require('inc/navbar.php') ?>
    <div class="header">
        <h1>Qui puoi modificare il tuo profilo, <?php echo $usernameSessione; ?>! </h1>
    </div>
    <div class="containerSettings">

        <div class="containerSettingsInner">
                <div class="navOpts">
                    <nav>
                        <a class="opt"> <i class="fa fa-user"></i></a>
                        <a class="opt"> <i class="fas fa-user-shield"></i></a>
                        <a class="opt"> <i class="fas fa-shield-alt"></i></a>
                        
                    </nav>
                </div>
                <div class="detailSettings">
                    <div style="text-align: center; width: 100%; height: 100%;" class="messaggioIniziale sectShowFirst">
                        <h4>Scelgi tra una le categorie affianco per modificare quello che vuoi del tuo profilo.
                            Una volta che hai modificato quello che vuoi devi inserire la tua password attuale ed il gioco è fatto!
                        </h4>
                    </div>
                    <div class="profileSettings sectShow">
                        <h1>Informazioni sul profilo</h1>
                        <input name="prevUsername" hidden type="text" value="<?php echo $usernameSessione ?>">
                        <label class="labelInput">
                            <img style="margin: 7% 0;" class="nuovaFotoProfilo" src="<? echo "./profileImages/".$pathFotoNavBar ?>" alt="">
                            <span class="spanInput">Premi sulla foto profilo per modificarla</span>
                        </label>
                        <label class="labelInput">
                            <input name="username" class="inputField" type="text" value="<?php echo $usernameSessione ?>" />
                            <span class="spanInput">Username</span>
                        </label>
                        <label class="labelInput">
                            <input name="biografia" class="inputField" type="text" value="<?php echo $biografia ?>" />
                            <span class="spanInput">Biografia</span>
                        </label>
                        <label class="labelInput">
                            <input name="email" class="inputField" type="text" value="<?php echo $email ?>" />
                            <span class="spanInput">E-mail</span>
                        </label>
                        <label style="margin-bottom: 6%;" class="labelInput">
                            <input style="margin-top: 10%;" name="passwordNuovaPassword" class="inputField" type="password" />
                            <span class="spanInput">Nuova password (lascia vuoto se non vuoi modificarla)</span>
                        </label>
                        <label style="display: none; margin-bottom: 6%;" id="passwordPrecedente" class="labelInput">
                            <input name="passwordPrecedente" class="inputField" type="password" />
                            <span class="spanInput">Password precedente</span>
                        </label>

                        <button class="submitInfoProfilo" style="margin-bottom: 5%;">Modifica</button>
                    </div>

                    <div class="personalInfoSettings sectShow">
                        <h1>Informazioni personali</h1>
                        <input name="prevUsername" hidden type="text" value="<?php echo $usernameSessione ?>">
                        <label class="labelInput">
                            <input name="nome" class="inputField" type="text" value="<?php echo $nome ?>" />
                            <span class="spanInput">Nome</span>
                        </label>
                        <label class="labelInput">
                            <input name="cognome" class="inputField" type="text" value="<?php echo $cognome ?>" />
                            <span class="spanInput">Cognome</span>
                        </label>
                        <label class="labelInput">
                            <input name="telefono" class="inputField" type="text" value="<?php echo $telefono ?>" />
                            <span class="spanInput">Telefono</span>
                        </label>
                        <label class="labelInput">
                            <select name="annoRegistrazione" class="annoRegistrazione">
                                <option value="<?php echo $annoNascita ?>" selected disabled><?php echo $annoNascita ?></option>
                            </select>
                            <select name="meseRegistrazione" class="meseRegistrazione">
                                <option value="<?php echo $meseNascita ?>" selected disabled><?php echo $mesi[$meseNascita-1] ?></option>
                            </select>
                            <select name="giornoRegistrazione" class="giornoRegistrazione">
                                <option value="<?php echo $giornoNascita ?>" selected disabled><?php echo $giornoNascita ?></option>
                            </select>
                            <span class="spanInput">Data di Nascita</span>
                        </label>
                        
                        <label style="margin-top: 6%;" class="labelInput">
                            <select name="genereRegistrazione" class="genereRegistrazione">
                                <option value="<?php echo $genere; ?>" selected disabled><?php echo $genereStr ?></option>
                                <option value="M">Maschio</option>
                                <option value="F">Femmina</option>
                                <option value="PFS">Preferisco non specificare</option>
                            </select>
                            <span class="spanInput">Genere</span>
                        </label>
                        <label style="margin-bottom: 5%;" id="passwordPrecedente" class="labelInput">
                            <input name="passwordPrecedente" class="inputField" type="password" />
                            <span class="spanInput">Password precedente</span>
                        </label>

                        <button class="submitInfoPersonali" style="margin-bottom: 5%;">Modifica</button>
                    </div>

                    <div class="privacySettings sectShow">
                        <h1>Modifica impostazioni Privacy</h1>
                        <h2>Account privato </h2>
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                        <h2>Visualizza i nostri Termini e Condizioni</h2>
                        <script>
                            let isChecked = <?php echo $tipoAccount ?>;
                            $('input[type="checkbox"]').prop('checked', isChecked);
                        </script>
                    </div>
                </div>
        </div>
    </div>
    <script> let nascondiCampi = false;</script>
    <script src="./javascript/controlsSettings.js"></script>
    <script src="./javascript/dateGenerator.js"></script>
    <script src="./javascript/controlsNavBar.js"></script>
</body>
</html>