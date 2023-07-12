<?php

/**
 * 
 * @author Necula Robert
 * @author Khan Shaz
 * 
 */


error_reporting(0);
//Inizio della sessione che avrà valori diversi nel caso in cui stiafacendo il login o la registrazione
session_start();

// //importo file per la trasmissione di email
// require('inc/PHPMailer.php');
// require('inc/SMTP.php');
// require('inc/Exception.php');

// //definizione namespace
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\SMTP;
// use PHPMailer\PHPMailer\Exception;
//Faccio la require del file di connessione al database
require('inc/query.php');
$conn = connectToDatabase();

/*Nel caso premesse il tasto di login, prendi i dati in input e cerca nel database un campo con quell'email inserita*/
/*se la trova e la password inserita corrisponde a quella trovata nel database, allora loggerà*/
/*nel caso le informazioni inserite siano sbagliate stampa un messaggio d'errore*/

if (isset($_POST['submit_login'])) {
    $emailLogin = $_POST['emailLogin'];
    $passwordLogin = $_POST['passwordLogin'];

    $resLogin = queryLogin($conn, $emailLogin);

    while ($row = mysqli_fetch_assoc($resLogin)) {
        $passwordDB = $row['Password'];
        $tipoUtente = $row['Tipo_Utente'];
        $usernameLogin = $row['Username'];
        $EmailConfermata = $row['EmailConfermata'];
    }

    if (md5($passwordLogin) == $passwordDB && $tipoUtente == 'A') {
        $_SESSION['logged'] = true;
        $_SESSION['isAdmin'] = true;
        $_SESSION['username'] = $usernameLogin;
        $error = false;
        header("Location: homePage.php");
    } else if ((md5($passwordLogin) == $passwordDB && $tipoUtente == 'G') && $EmailConfermata == 1) {

        $_SESSION['logged'] = true;
        $_SESSION['username'] = $usernameLogin;
        $error = false;
        header("Location: homePage.php");
    } else $error = true;
}


//altervista ha le porte per l'invio delle mail bloccate, ho dovuto utilizzare un servizio esterno
// if($_POST['sendEmail']){
/**Configuro l'email e la madno */
// try{
// $emailEmail = $_SESSION['emailRegistrazione'];
// $usernameEmail = $_SESSION['usernameProfilo'];
// $msgMail = $_SESSION['msgMail'];

// $mail = new PHPMailer(true);
// $mail->charSet = 'UTF-8';
// $mail->isSMTP();
// $mail->SMTPAutoTLS = false;
// $mail->Host = 'smtp.gmail.com';
// $mail->SMTPAuth = true;
// $mail->Username = 'paki.rom03@gmail.com';
// $mail->Password = 'Paki&RomSocialNetwork';
// $mail->SMTPSecure = false;
// $mail->Port = 587;
// $mail->SMTPOptions = array(
//     'ssl' => array(
//         'verify_peer' => false,
//         'verify_peer_name' => false,
//         'allow_self_signed' => true
//     )
// );
// $mail->setFrom('paki.rom03@gmail.com');
// $mail->FromName = 'Paki&Rom';
// $mail->addAddress($emailEmail, $usernameEmail);
// $mail->Subject = "Conferma indirizzo email";
// $mail->isHTML(true);
// $mail->Body = $msgMail;
// $success = $mail->send();
// }catch(Exception $e){
//     echo "Errore: ".$e->errorMessage();
// }
// }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1">
    <title>Login</title>
    <link rel="stylesheetasdasdas" href="css/bootstrap.css">
    <link rel="stylesheetasdasdas" href="css/animations.css">
    <link rel="stylesheetasdasdas"asdasdas href="css/styleLogin.css">
</head>

<body>
    <?php if (!$_SESSION['asdasdaslogged']) { ?>
        <section>
            <div class="conasdasdast">
                <!--- Half of The Image -->
                <div class="iasdasdasmageBox">
                    <img src="assets/Logo.jpeg" alt="Impossibile caricare l'immagine.">
                </div>asdasdas

                <!--- Half of asdasdasThe Login Form -->

                <div class="loginBox">
                    <div class="formBox">
                        <h1 class="slide-in-bottom-h1">Login</h1>
                        <form action="index.php?nonsense=1" method="post">
                            <div style="display: none;" class="message_success_reg alert alert-success"></div>
                            <?php if ($error) echo "<div class='message_login alert alert-danger' role='alert'>E-mail o password inseriti non sono corretti oppure non hai ancora confermato il tuo account.</div>"; ?>

                            <div class="inputBox">
                                <img class="emailLogin" style="padding-top: 0.2%;" src="./assets/email-icon.png" alt="">
                                <input type="email" class="emailLogin" name="emailLogin" placeholder="Email">
                            </div>
                            <div class="inputBox">
                                <img class="passwordLogin" src="./assets/password_icon.png" alt="">
                                <input minlength="6" maxlength="20" class="passwordLogin" type="password" name="passwordLogin" placeholder="Password">
                            </div>
                            <div class="inputBox">
                                <button type="submit" name="submit_login">Sign in</button>
                            </div>
                            <div class="inputBox">
                                <p>Non&nbsp;hai&nbsp;un&nbsp;account?&nbsp;<a class="goToRegister1" href="#">Iscriviti</a></p>
                            </div>
                            <div style="margin-top: -3%;" class="inputBox">
                                <!-- <a href="#" class="passwordDimenticata">Password&nbsp;dimenticata?</a> -->
                            </div>
                        </form>
                    </div>
                </div>

                <div class="register1Box">
                    <div class="formBox">
                        <h1 class="fade-in">Benvenuto!</h1>
                        <h2 class="slide-in-right-h1">Inizia&nbsp;inserendo&nbsp;queste&nbsp;informazioni</h2>
                        <div style="display: none; font-size: 0.8em; width: fit-content; height: fit-content;" class='message_reg1 alert alert-danger' role='alert'></div>

                        <div class="inputBox">
                            <img class="nomeRegistrazione" src="./assets/nome_cognome_icon.png" alt="">
                            <input class="nomeRegistrazione" type="text" name="nomeRegistrazione" placeholder="Nome *">
                        </div>
                        <div class="inputBox">
                            <img class="cognomeRegistrazione" src="./assets/nome_cognome_icon.png" alt="">
                            <input class="cognomeRegistrazione" type="text" name="cognomeRegistrazione" placeholder="Cognome *">
                        </div>
                        <div class="inputBox">
                            <img class="emailRegistrazione" style="padding-top: 0.2%;" src="./assets/email-icon.png" alt="">
                            <input class="emailRegistrazione" type="email" name="emailRegistrazione" placeholder="Email *">
                        </div>
                        <div class="inputBox">
                            <img class="passwordRegistrazione" src="./assets/password_icon.png" alt="">
                            <input minlength="6" maxlength="20" class="passwordRegistrazione" type="password" name="passwordRegistrazione" placeholder="Password *">
                        </div>
                        <div class="inputBox">
                            <img class="passwordRegistrazioneConferma" src="./assets/password_icon.png" alt="">
                            <input minlength="6" maxlength="20" class="passwordRegistrazioneConferma" type="password" name="passwordRegistrazioneConferma" placeholder="Conferma Password *">
                        </div>
                        <div class="inputBox">
                            <button onclick="checkRegister1();" class="goToRegister2" name="goToRegister2">Continua</button>
                        </div>
                        <!-- </form> -->

                    </div>
                </div>

                <div class="register2Box">
                    <div class="formBox">
                        <h1 class="fade-in">Ottimo!</h1>
                        <br>
                        <h2 class="slide-in-right-h1">Continua!&nbsp;Abbiamo&nbsp;quasi&nbsp;finito</h2>
                        <!-- <form> -->
                        <div style="display: none; font-size: 0.8em; width: fit-content; height: fit-content;" class='message_reg2 alert alert-danger' role='alert'></div>
                        <div class="inputBox">
                            <img class="telefonoRegistrazione" src="./assets/telefono_icon.png" alt="">
                            <input class="telefonoRegistrazione" type="text" name="telefonoRegistrazione" placeholder="Telefono">
                        </div>
                        <div class="inputBox">
                            <select name="annoRegistrazione" class="annoRegistrazione">
                                <option value="" selected disabled>Anno *</option>
                            </select>
                            <select name="meseRegistrazione" class="meseRegistrazione">
                                <option value="" selected disabled>Mese *</option>
                            </select>
                            <select name="giornoRegistrazione" class="giornoRegistrazione">
                                <option value="" selected disabled>Giorno *</option>
                            </select>
                        </div>
                        <div class="inputBox">
                            <select name="genereRegistrazione" class="genereRegistrazione">
                                <option value="" selected disabled>Genere *</option>
                                <option value="M">Maschio</option>
                                <option value="F">Femmina</option>
                                <option value="PFS">Preferisco non specificare</option>
                            </select>
                        </div>
                        <div class="inputBox">
                            <button onclick="checkRegister2();" class="goToRegister3" name="goToRegister3">Continua</button>
                        </div>
                        <!-- </form> -->
                    </div>
                </div>

                <!-- username e foto profilo-->

                <div class="register3Box">
                    <div class="formBox">
                        <h1 class="fade-in">Ultimo&nbsp;passaggio!</h1>
                        <h2 class="slide-in-right-h1">Inserisci&nbsp;i&nbsp;dati&nbsp;per&nbsp;il&nbsp;tuo&nbsp;profilo.</h2>
                        <div style="display: none; font-size: 0.8em; width: fit-content; height: fit-content;" class='message_reg3 alert alert-danger' role='alert'></div>
                        <div class="inputBox">
                            <img style="filter: none;" class="fotoProfilo" src="./assets/default_user_icon.png" alt="">
                        </div>
                        <div class="inputBox">
                            <input class="usernameProfilo" type="text" name="usernameProfilo" placeholder="Username *">
                        </div>
                        <div class="inputBox">
                            <textarea class="biografiaProfilo" type="text" name="biografiaProfilo" placeholder="Biografia"></textarea>
                        </div>
                        <div class="inputBox">
                            <button onclick="sendAllData();" type="submit" name="submit_registration">Termina registrazione</button>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    <?php } else header("Location: homePage.php") ?>

    <section>
        <!--SCHERMATA SOVRIMPRESSIONE DEL POST CON I SUOI RELATIVI DATI -->
        <div id="modalPost" class="modalPost">
            <div class="modalPostBody">
                <button class="chiudiModal">&times;</button>
                <div class="modalPostBodyInner">
                    <div style="display: none; font-size: 0.9em;" class='message_resetEmail alert alert-danger' role='alert'></div>
                    <p>Inserisci la tua email, ti invieremo la procedura per creare una nuova password.</p>
                    <input type="email" class="emailPasswordDimenticata">
                    <button class="inviaEmailReset">Invia Email</button>
                </div>
            </div>
        </div>
    </section>
    <div class="overlay"></div>

    <script>
        let nascondiCampi = true;
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="./javascript/controls.js"></script>
    <script src="./javascript/animations_logReg.js"></script>
    <script src="./javascript/dateGenerator.js"></script>
</body>

</html>