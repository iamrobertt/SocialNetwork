<nav class="navbar">
    <div class="nb-left">
        <a class="redirectFotoLogo" href="./homePage.php"><img class="fotoLogo" src="./assets/logo_scritta_finale.png" alt=""></a>
        <a href="https://necular.altervista.org/SocialNetwork/createPost.php">
        <img class="creaPostNavBar" src="./assets/nuovopost_icon.png" alt=""></li></a>
        <div class="notificationsBox contNotifications">
            <img class="notifications-user" src="./assets/notifications.png" alt="">
        </div>

        <div class="dropdown-notifications">
            <div class="dropdown-notifications-inner">
                <div class="dropdown-notifications-header">
                    <h1>Notifiche</h1>
                </div>
                <div class="dropdown-notifications-body">
                </div>
            </div>
        </div>
    </div>

    <div class="nb-right">
        <?php if ($displaySearchBox) { ?>
            <div class="searchBox">
                <input class="searchInput" type="text" placeholder="Search">
            </div>
        <?php } ?>

        <div class="contFP">
            <img class="fotoProfilo" src="./profileImages/<?php echo $pathFotoNavBar ?>" alt="">
        </div>

        <div class="dropdown-menu-user">
            <div class="dropdown-menu-user-inner">
                <div class="settings-menu">
                    <img style="cursor: default;" class="fotoProfilo" src="./profileImages/<?php echo $pathFotoNavBar ?>" alt="">
                    <div class="usernameProfilo">
                        <p><?php echo $usernameSessione ?></p>
                        <a href="profile.php">Visualizza il tuo profilo</a>
                    </div>
                    <hr>
                </div>

                <div class="settings-menu">
                    <img style="cursor: default;" class="fotoProfilo" src="./assets/nuovopost_icon.png" alt="">
                    <div class="nuovoPost">
                        <p>Nuovo Post</p>
                        <a href="createPost.php">Crea un nuovo post</a>
                    </div>
                    <hr>
                </div>

                <div class="settings-menu">
                    <img style="cursor: default;" class="fotoSettings" src="./assets/settings_icon.png" alt="">
                    <div class="settingsProfilo">
                        <p>Impostazioni e Privacy</p>
                        <a class="modified-a" href="settingsnprivacy.php">Modifica impostazioni</a>
                    </div>
                    <hr>
                </div>

                <div class="settings-menu">
                    <img class="fotoLogout" src="./assets/logout_icon.png" alt="">
                    <div class="logoutProfilo">
                        <p>Logout</p>
                        <a class="modified-a logout" href="#" onclick="confirmLogout();">Effettua il Logout</a>
                    </div>
                    <hr>
                </div>

                <div class="settings-menu">
                    <img class="fotoFeedBack" src="./assets/feedback_icon.png" alt="">
                    <div class="feedBackProfilo">
                        <p>Feedback</p>
                        <a class="modified-a" href="#">Dacci il tuo parere!</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</nav>