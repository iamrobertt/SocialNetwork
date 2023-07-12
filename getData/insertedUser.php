<?php 
error_reporting(0);
//Inizio della sessione che avrà valori diversi nel caso in cui stiafacendo il login o la registrazione
session_start();
require('../inc/query.php');
$conn = connectToDatabase();

/**Per rendere univoche anche le foto (nel caso in cui ci siano 2 foto con lo stesso nome ed estensione) aggiungo al nome della foto
 * l'email dell'utente e faccio l'hash md5
*/
function insertFile(){
    $target_dir = "profileImages/";

    //dettagli del file inserito
    $file = $_FILES['fotoProfilo']['name'];
    $path = pathinfo($file);
    $filename = $path['filename'];
    $ext = $path['extension'];

    //unisco nome del file e email dell'utente per rendere la foto sicuramente univoca
    $fileMergeName = $filename . $_SESSION['emailRegistrazione'];
    $fileMergeName .= rand(1111,9999);
    $finalName = md5($fileMergeName). "." . $ext;

    //ultimi paddaggi per poter inserire il file correttamente
    $temp_name = $_FILES['fotoProfilo']['tmp_name'];
    $path_filename_ext = $target_dir.$finalName;

    //$finalPath = $_SERVER['DOCUMENT_ROOT']."/".$path_filename_ext;
    
    //inserimento del file nella cartella e assegno il nome del file alla variabile di sessione per poter inserire tutto alla fine
    $_SESSION['nomeFotoProfilo'] = $finalName;
    $checkMoved = move_uploaded_file($temp_name, $path_filename_ext);
}

if(isset($_FILES['fotoProfilo'])){
    //directory dove andrà il file
   insertFile();
}


if(isset($_FILES['fotoProfilo'])) insertFile();
/** Se tutta la registrazione viene completata e viene premuto il bottone, allora fai la query di inserimento nel database */
if($_POST['biografiaProfilo']){
    
    /* Prendo tutte le variabili arrivate dalla post di javascript (già validate) e creo delle variabili di sessione con il loro valore all'interno*/
    /* Provato molti modi ma è l'unico funzionante*/

    $nomeRegistrazione = $_POST['nomeRegistrazione'];
    $cognomeRegistrazione = $_POST['cognomeRegistrazione'];
    $emailRegistrazione = $_POST['emailRegistrazione'];
    $passwordRegistrazione = $_POST['passwordRegistrazione'];
    $genereRegistrazione = $_POST['genereRegistrazione'];
    $telefonoRegistrazione = $_POST['telefonoRegistrazione'];
    $dataRegistrazione = $_POST['dataRegistrazione'];
    $usernameProfilo = $_POST['usernameProfilo'];
    $biografiaProfilo = $_POST['biografiaProfilo'];
    $hashedPwd = md5($passwordRegistrazione);
    $token = md5($emailRegistrazione).rand(1111111,999999);
    $_SESSION['token'] = $token;
    //query inserimento
    if($_SESSION['nomeFotoProfilo'] == null || $_SESSION['nomeFotoProfilo'] == "") $nomeFotoProfilo = "default_user_icon.png";
    else $nomeFotoProfilo = $_SESSION['nomeFotoProfilo'];
    $resIns = queryInsertUser($conn, $usernameProfilo, $emailRegistrazione, $hashedPwd, $nomeRegistrazione, $cognomeRegistrazione, $dataRegistrazione, $genereRegistrazione, $nomeFotoProfilo, $telefonoRegistrazione, $biografiaProfilo, $token);  /**Una volta fatta la query finisco la sessione coi dati precendeti e ne inizio un'altra con le varibiali di sessione che servono per l'app */

    echo json_encode(array('inseritoCorrettamente' => $resIns));
}?>