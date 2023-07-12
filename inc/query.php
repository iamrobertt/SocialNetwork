<?php

function connectToDatabase() {
    $db_user = "necular";
    $db_host = "localhost";
    $db_password = "EE7FZq6TBHNp";
    $db_name = "my_necular";

    $conn = mysqli_connect($db_host, $db_user, $db_password, $db_name);
    if(mysqli_connect_errno()){
        echo "Errore durante la connessione.". mysqli_connect_error();
        exit();
    }

    return $conn;
}

function closeConnection($conn){
    mysqli_close($conn);
}

function queryLogin($conn, $email){
    $queryLogin = "SELECT Password, Tipo_Utente, Username, EmailConfermata from Utente WHERE Email = \"$email\"";
    $resLogin = mysqli_query($conn, $queryLogin);
    return $resLogin;
}
function queryGetEmail($conn, $username){
    $queryGetEmail = "SELECT Email from Utente WHERE Username = \"$username\"";
    $resGetEmail = mysqli_query($conn, $queryGetEmail);
    $email = mysqli_fetch_assoc($resGetEmail);
    return $email['Email'];
}

function queryProfilo($conn, $username){
    $queryProfilo = "SELECT Immagine_Profilo, Biografia FROM Utente WHERE Username = \"$username\"";
    $resQueryProfilo = mysqli_query($conn, $queryProfilo);
    return $resQueryProfilo;
}

function queryFotoProfilo($conn, $username){
    $queryFotoProfilo = "SELECT Immagine_Profilo FROM Utente WHERE Username = \"$username\"";
    $resQueryFotoProfilo = mysqli_query($conn, $queryFotoProfilo);
    $fotoProfilo = mysqli_fetch_assoc($resQueryFotoProfilo);
    return $fotoProfilo['Immagine_Profilo'];
}

function queryContPostUser($conn, $username){
    $queryPost = "SELECT COUNT('Id_Post') AS 'Num_Post' FROM `Post` WHERE `Username`=\"$username\"";
    $resQueryPost = mysqli_query($conn, $queryPost);
    $contPosts = mysqli_fetch_assoc($resQueryPost);
    return $contPosts['Num_Post'];
}

function queryContFollowerUser($conn, $username){
    $queryContFollower = "SELECT COUNT('Data_Follow') AS 'Num_Follower' FROM `Follower` WHERE `Username_Seguito`=\"$username\" AND `Follow_Sospeso`= 0";
    $resQueryContFollower = mysqli_query($conn, $queryContFollower);
    $contFollower = mysqli_fetch_assoc($resQueryContFollower);
    return $contFollower['Num_Follower'];
}

function queryContFollowing($conn, $username){
    $queryContFollowing = "SELECT COUNT('Data_Follow') AS 'Num_Following' FROM `Follower` WHERE `Username_Segue`=\"$username\" AND `Follow_Sospeso`= 0";
    $resQueryContFollowing = mysqli_query($conn, $queryContFollowing);
    $contFollowing = mysqli_fetch_assoc($resQueryContFollowing);
    return $contFollowing['Num_Following'];
}

function queryCheckFollow($conn, $usernameSessione, $username){
    $queryCheckFollow = "SELECT * FROM `Follower` WHERE `Username_Segue`=\"$usernameSessione\" AND `Username_Seguito`=\"$username\"";
    $resQueryCheckFollow = mysqli_query($conn, $queryCheckFollow);
    return mysqli_num_rows($resQueryCheckFollow);
}

function queryInsertFollow($conn, $date, $utenteSegue, $utenteSeguito, $follow_sospeso){
    $queryFollow = "INSERT INTO `Follower` (`Data_Follow`, `Username_Segue`, `Username_Seguito`, `Follow_Sospeso`) VALUES (\"$date\", \"$utenteSegue\", \"$utenteSeguito\", \"$follow_sospeso\");";
    mysqli_query($conn, $queryFollow);
}

function queryInsertPost($conn, $id_post, $dateTime, $usernameSessione, $finalName, $descrizioneCreaPost){
    $queryInsPost = "INSERT INTO `Post` (`Id_Post`, `Data_Post`, `Username`, `Foto_Post`, `Descrizione`) VALUES (\"$id_post\", \"$dateTime\", \"$usernameSessione\", \"$finalName\", \"$descrizioneCreaPost\")";
    mysqli_query($conn, $queryInsPost);
}

function queryDeleteFollow($conn, $utenteSeguito, $utenteSegue){
    $queryDelFollower = "DELETE FROM `Follower` WHERE `Username_Seguito` = \"$utenteSeguito\" AND `Username_Segue` = \"$utenteSegue\";";
    mysqli_query($conn, $queryDelFollower);
}

function queryContTotPost($conn){
    $queryTotalPosts = "SELECT COUNT('Id_Post') AS 'Tot_Post' FROM `Post`";
    $resQueryTotalPosts = mysqli_query($conn, $queryTotalPosts);
    $contPost = mysqli_fetch_assoc($resQueryTotalPosts);
    return $contPost['Tot_Post'];
}

function queryCheckEmailReg($conn, $emailRegistrazione){
    $queryContrEmail= "SELECT Email from Utente WHERE Email = \"$emailRegistrazione\"";
    $resContrEmail = mysqli_query($conn, $queryContrEmail);
    return $resContrEmail;
}

function queryCheckPhone($conn, $telefonoRegistrazione){
    $queryContrTelefono = "SELECT Telefono from Utente WHERE Telefono = \"$telefonoRegistrazione\"";
    $resContrTelefono = mysqli_query($conn, $queryContrTelefono);
    return $resContrTelefono;
}

function queryCheckUsername($conn, $usernameProfilo){
    $queryContrUsername = "SELECT Username from Utente WHERE Username = \"$usernameProfilo\"";
    $resContrUsername = mysqli_query($conn, $queryContrUsername);
    return $resContrUsername;
}

function querySearchUser($conn, $usernameDaCercare){
    $queryCercaUtente = "SELECT Username, Immagine_Profilo, Biografia FROM Utente WHERE Username LIKE \"%$usernameDaCercare%\"";
    $resQueryCercaUtente = mysqli_query($conn, $queryCercaUtente);
    return $resQueryCercaUtente;
}

function queryFeed($conn, $usernameProfilo){
    $queryFeed = "SELECT Foto_Post, Descrizione, Username_Seguito,Data_Post, Immagine_Profilo FROM Utente,Post,Follower WHERE Data_Post >  SUBDATE(CURDATE(),5) AND Username_Segue= \"$usernameProfilo\" AND Post.Username=Utente.Username AND Follower.Username_Seguito=Utente.Username AND Follow_Sospeso=0;";
    $resQueryFeed = mysqli_query($conn, $queryFeed);
    return $resQueryFeed;
}

function queryStampaPost($conn, $usernamePosts){
    $queryStampaPosts = "SELECT Data_Post, Foto_Post, Descrizione FROM `Post` WHERE `Username`= \"$usernamePosts\"";
    $resQueryStampaPosts = mysqli_query($conn, $queryStampaPosts);
    return $resQueryStampaPosts;
}

function queryInsertUser($conn, $usernameProfilo, $emailRegistrazione, $hashedPwd, $nomeRegistrazione, $cognomeRegistrazione, $dataRegistrazione, $genereRegistrazione, $nomeFotoProfilo, $telefonoRegistrazione, $biografiaProfilo, $token){
    $queryIns = "INSERT INTO `Utente` VALUES (\"$usernameProfilo\", \"$emailRegistrazione\", \"$hashedPwd\", \"$nomeRegistrazione\", \"$cognomeRegistrazione\", \"$dataRegistrazione\", \"$genereRegistrazione\", \"G\", \"$nomeFotoProfilo\", \"$telefonoRegistrazione\", \"$biografiaProfilo\", \"0\", \"$token\", \"0\");";
    $resIns = mysqli_query($conn, $queryIns); 
    return $resIns;
}

function queryGetDataUSer($conn, $usernameSessione){
    $queryGetDataUser = "SELECT * FROM `Utente` WHERE `Username` = \"$usernameSessione\"";
    $resQueryGetDataUser = mysqli_query($conn, $queryGetDataUser);
    return $resQueryGetDataUser;
}

function queryModUSer($conn, $prevUsername, $nuovoUsername, $email, $password, $nome, $cognome, $nuovaData, $genere, $pathFotoProfilo, $telefono, $biografia){ 
    $qqueryModUser = "UPDATE Utente SET Username = \"$nuovoUsername\", Email = \"$email\", Password = \"$password\", Nome = \"$nome\", Cognome = \"$cognome\", DataNascita = \"$nuovaData\", Genere = \"$genere\", Immagine_Profilo = \"$pathFotoProfilo\", Telefono = \"$telefono\", Biografia = \"$biografia\" WHERE Username = \"$prevUsername\"";
    var_dump($qqueryModUser);
    mysqli_query($conn, $qqueryModUser);
}
function queryCheckConfirmEmail($conn, $email, $token){
    $queryCheckConfirmEmail = "SELECT * FROM `Utente` WHERE `Email` = \"$email\" AND `Token` = \"$token\"";
    $resQueryCheckConfirmEmail = mysqli_query($conn, $queryCheckConfirmEmail);
    return $resQueryCheckConfirmEmail;
}

function queryConfirmEmail($conn, $email, $token){
    $queryConfirmEmail = "UPDATE Utente SET EmailConfermata = 1 WHERE Email = \"$email\" AND Token = \"$token\"";
    $resQueryConfirmEmail = mysqli_query($conn, $queryConfirmEmail);
    return $resQueryConfirmEmail;
}

function queryModalPost($conn, $src){
    $queryModalPost = "SELECT * FROM `Post` WHERE `Foto_Post` = \"$src\"";
    $resQueryModalPost = mysqli_query($conn, $queryModalPost);
    return $resQueryModalPost;
}
function queryGetIDPost($conn, $src){
    $queryGetIDPOst = "SELECT `Id_Post` FROM `Post` WHERE `Foto_Post` = \"$src\"";
    $resQueryGetIDPOst = mysqli_query($conn, $queryGetIDPOst);
    $id_post = mysqli_fetch_assoc($resQueryGetIDPOst);
    return $id_post['Id_Post'];
}

function queryInsertCommento($conn, $id_commento, $commento,  $username, $id_post, $dataCommento){
    $queryInsertCommento = "INSERT INTO `Commenti`(`Id_Commento`, `Descrizione_Commento`, `Username`, `Id_Post`, `DataCommento`) VALUES (\"$id_commento\", \"$commento\", \"$username\", \"$id_post\", \"$dataCommento\");";
    mysqli_query($conn, $queryInsertCommento);
}

function queryGetCommenti($conn, $id_post){
    $queryGetCommenti = "SELECT * FROM `Commenti` WHERE `Id_Post` = \"$id_post\"";
    $resQueryGetCommenti = mysqli_query($conn, $queryGetCommenti);
    return $resQueryGetCommenti;
}
function queryContLike($conn){
    $queryContLike = "SELECT COUNT('Data_Like') AS 'Tot_Like' FROM `Like`";
    $resQueryContLike = mysqli_query($conn, $queryContLike);
    $contLike = mysqli_fetch_assoc($resQueryContLike);
    return $contLike['Tot_Like'];
}

//non funziona bene
function queryInsertLike($conn, $dataLike, $username, $id_post){
    $queryInsertLike =  "INSERT INTO `Like`(`Data_Like`, `Username`, `Id_Post`) VALUES (\"$dataLike\" ,\"$username\", \"$id_post\");";
    mysqli_query($conn, $queryInsertLike);
}

function queryContLikePost($conn, $id_post){
    $queryContLikePost = "SELECT COUNT('Id_Like') AS 'Tot_Like' FROM `Like` WHERE `Id_Post` = \"$id_post\"";
    $resQueryContLikePost = mysqli_query($conn, $queryContLikePost);
    $totLike = mysqli_fetch_assoc($resQueryContLikePost);
    return $totLike['Tot_Like'];
}

function queryCheckLikePost($conn, $id_post, $username) {
    $queryCheckLike = "SELECT * FROM `Like` WHERE `Id_Post` = \"$id_post\" AND `Username` = \"$username\"";
    $resQueryCheckLike = mysqli_query($conn, $queryCheckLike);
    //ritorno il numero di righe per sapere se l'utente ha già messo like oppure no
    return mysqli_num_rows($resQueryCheckLike);
}

function queryDelLikePost($conn, $id_post, $username) {
    $queryDelLike = "DELETE FROM `Like` WHERE `Id_Post` = \"$id_post\" AND `Username` = \"$username\"";
    $resQueryDelLike = mysqli_query($conn, $queryDelLike);
    return $resQueryDelLike;
}
function queryContTotComments($conn){
    $queryContTotComments = "SELECT COUNT('Data_Commento') AS 'Tot_Commenti' FROM `Commenti`";
    $resQueryContTotComments = mysqli_query($conn, $queryContTotComments);
    $totComments = mysqli_fetch_assoc($resQueryContTotComments);
    return $totComments['Tot_Commenti'];
}

function queryContComments($conn, $id_post){
    $queryContComments = "SELECT COUNT('Id_Commento') AS 'Tot_Commenti' FROM `Commenti` WHERE `Id_Post` = \"$id_post\"";
    $resQueryContComments = mysqli_query($conn, $queryContComments);
    $totComments = mysqli_fetch_assoc($resQueryContComments);
    return $totComments['Tot_Commenti'];
}

function queryChangeAccountType($conn, $isPrivate, $username){
    $queryChangeAccountType = "UPDATE Utente SET Account_Privato = \"$isPrivate\" WHERE Username = \"$username\"";
    mysqli_query($conn, $queryChangeAccountType);
}

function queryGetAccountType($conn, $username){
    $queryGetAccountType = "SELECT Account_Privato FROM Utente WHERE Username = \"$username\"";
    $resQueryGetAccountType = mysqli_query($conn, $queryGetAccountType);
    $row = mysqli_fetch_assoc($resQueryGetAccountType);
    return $row['Account_Privato'];
}

function queryGetPendingRequests($conn, $username){
    $queryGetPendingRequests = "SELECT Username_Segue FROM Follower WHERE Username_Seguito = \"$username\" AND Follow_Sospeso = 1";
    $resQueryGetPendingRequests = mysqli_query($conn, $queryGetPendingRequests);
    return $resQueryGetPendingRequests;
}

function queryGetTypeFOllow($conn, $username_segue, $username_seguito){
    $queryGetTypeFOllow = "SELECT Follow_Sospeso FROM Follower WHERE Username_Segue = \"$username_segue\" AND Username_Seguito = \"$username_seguito\"";
    $resQueryGetTypeFOllow = mysqli_query($conn, $queryGetTypeFOllow);
    $row = mysqli_fetch_assoc($resQueryGetTypeFOllow);
    return $row['Follow_Sospeso'];
}

function updatePendingFollow($conn, $username_seguito, $username_segue){
    $queryUpd = "UPDATE Follower SET Follow_Sospeso = 0 WHERE Username_Segue = '$username_segue' AND Username_Seguito = '$username_seguito'";
    mysqli_query($conn, $queryUpd);
}

function queryResetPassword($conn, $email, $password){
    $hashedPwd = md5($password);
    $queryResetPassword = "UPDATE Utente SET Password = \"$hashedPwd\" WHERE Email = \"$email\"";
    mysqli_query($conn, $queryResetPassword);
}