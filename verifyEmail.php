<?php

session_start();
error_reporting(0);
require('inc/query.php');
$conn = connectToDatabase();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica dell'email</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/styleVerifyEmail.css">
</head>
<body>
    <?php
    if($_GET['key']){

        $email = $_GET['key'];
        $token = $_GET['token'];
        $resQueryCheckConfirmEmail = queryCheckConfirmEmail($conn, $email, $token);
        //ha trovato un utente con email e token
        if(mysqli_num_rows($resQueryCheckConfirmEmail) > 0){
            $emailConfermata = mysqli_fetch_assoc($resQueryCheckConfirmEmail)['EmailConfermata'];
            if(!$emailConfermata){
                $msg = "La tua email è stata confermata, ora puoi accedere al nostro sito.";
                $resQueryConfirmEmail = queryConfirmEmail($conn, $email , $token);
            }
            else  $msg = "La tua email è già stata confermata, puoi già accedere al nostro sito.";
        }
        else $msg = "Qualcosa è andato storto con la conferma dell'email, sembra che i dati non siano corretti.<br>Per favore, riprova e, se continui ad avere problemi, contattaci.";
    }
    else $msg = "Nessuna email o token di conferma sono stati forniti.";

    ?>
    <div class="containerVE">
        <div class="containerVEInner">
            <h1>Verifica email dell'utente</h1>
            <p><?php echo $msg; ?></p>
        </div>
    </div>
</body>
</html>