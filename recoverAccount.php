<?php 

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
    <title>Document</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/styleRecoverAccount.css">
</head>

<body>

<?php

    $msg = "";
    $msgSuccess = "";
    if(isset($_POST['btn-riattivaAccount'])){
        $email = $_POST['email'];
        $password = $_POST['nuovaPassword'];
        $confermaPassword = $_POST['confermaNuovaPassword'];

        $password = filter_var($password, FILTER_SANITIZE_STRING);
        $confermaPassword = filter_var($confermaPassword, FILTER_SANITIZE_STRING);
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        
        if($password != "" && $confermaPassword != "" && $password == $confermaPassword){
            queryResetPassword($conn, $email, $password);
            if(mysqli_affected_rows($conn) == 1) $msgSuccess = "La tua password è stata resettata con successo!";
            else $msgError = "La tua password non è stata resettata, riprova.";
        }
        else $msgError = "Le password non coincidono";

    }

?>
    <div class="containerRA">
        <div class="containerRAInner">
        <?php if($msg != "") echo "<div class='message_login alert alert-danger' role='alert'>echo $msgError;</div>"; ?>
        <?php if($msgSuccess != "") "<div class='message_login alert alert-success' role='alert'>echo $msgSuccess;</div>"; ?>
            <form method="POST">
                <h1>Inserisci i dati per poter ricominciare ad usare il tuo account.</h1>
                <br>
                <input type="email" placeholder="E-mail">
                <br>
                <input type="password" class="nuovaPassword" placeholder="Nuova password">
                <br>
                <input type="password" class="confermaNuovaPassword" placeholder="Conferma nuova password">
                <br>
                <button name="btn-riattivaAccount">Riattiva account</button>
            </form>
        </div>
    </div>

</body>

</html>