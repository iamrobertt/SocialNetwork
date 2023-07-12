let urlNavBar = window.location.href;
let contNotifications;
let urlManageNotifications = "https://necular.altervista.org/SocialNetwork/getData/getUserNotifications.php";

async function sendPostData(url, data, success, error) {
    await $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        error: error,
    });
}

function cancellaElementi(elemento) {
    while (elemento.children().length > 0) elemento.children().remove();
}

async function confirmLogout() {
    let confirmLogout = confirm("Sei sicuro di voler effettuare il logout?");
    if (confirmLogout) await sendPostData(urlNavBar, { logout: true }, () => { window.location.href = "https://necular.altervista.org/SocialNetwork/index.php"; }, () => { });
}

$('.fotoProfilo').on('click', function () {
    $('.dropdown-menu-user').toggleClass('active');
});

$('.notifications-user').on('click', function () {
    $('.dropdown-notifications').toggleClass('active');
});

//da finire per tutte le casistiche
$(document).on('click', function (e) {
    if ($(e.target).is('.fotoProfilo') || $(e.target).is('.dropdown-menu-user') || $(e.target).is('.dropdown-menu-user-inner')) return;
    else if ($('.dropdown-menu-user').hasClass('active')) $('.dropdown-menu-user').toggleClass('active');
});

// $(document).on('click', function (e) {
//     if ($(e.target).is('.notifications-user') || $(e.target).is('.dropdown-notifications') || $(e.target).is('.dropdown-notifications-body') || $(e.target).is('.dropdown-notifications-header')) return;
//     else if ($('.dropdown-notifications').hasClass('active')) $('.dropdown-notifications').toggleClass('active');
// });

function drawNotifications(dataNotifications, contNotifications) {

    let notificationsBox = $('.dropdown-notifications-body');
    if(Object.keys(dataNotifications).length == 0) {
        cancellaElementi(notificationsBox);
        $('.notificationsBox').removeClass('contNotifications');
        notificationsBox.append('<p class = "noPost"><br><br>Ancora nessuna notifica.</p>');
        return;
    }

    if(!$('.notificationsBox').hasClass('contNotifications')) $('.notificationsBox').addClass('contNotifications');
    //da finire contatore di notifiche
    cancellaElementi(notificationsBox);

    let username_segue = [];
    let msg = [];
    let pathFotoProfiloNotifiche = [];
    let contNotificationsText = [];

    $.each(contNotifications, function (index, data) {
        contNotificationsText.push(data.contNotifications);
    });

    $.each(dataNotifications, function (i, data) {
        username_segue.push(data.username_segue);
        msg.push(data.msg);
        pathFotoProfiloNotifiche.push(data.foto_profilo);
    });

    for (let i = 0; i < username_segue.length; i++) notificationsBox.append(`
    <div class="notificationBox">
        <img class="fotoProfiloNotifica" src="./profileImages/${pathFotoProfiloNotifiche[i]}" alt="">
        <div class="dettagliNotifica">
            <input type="hidden" value="${username_segue[i]}">
            <span>${msg[i]}</span>
            <br>
            <div class="actionsNotifica">
                <a class="accept">ACCETTA <span class="fa fa-check"></span></a>
                <a class="deny">RIFIUTA <span class="fa fa-close"></span></a>
            </div>
            <hr>
        </div>
    </div>
    `);

}
$(document).on('click', '.accept', async function () {
    let username_segue = $(this).parent().parent().find('input').val();
    await sendPostData(urlManageNotifications, {aggiornaFollowSospeso: username_segue}, () => { $(this).parent().parent().prev().hide(500); $(this).parent().parent().hide(500);}, () => { });
});

$(document).on('click', '.deny', async function () {
    let username_segue = $(this).parent().parent().find('input').val();
    await sendPostData(urlManageNotifications, {cancellaFollowSospeso: username_segue}, () => { $(this).parent().parent().prev().hide(500); $(this).parent().parent().hide(500); }, () => { });
});

$(document).ready(async function () {
        await sendPostData(urlManageNotifications, {getNumNotifications: true},(data) => {contNotifications = JSON.parse(data)}, () => {});
        await sendPostData(urlManageNotifications, { getNotifications: true }, (data) => { notifications = JSON.parse(data); drawNotifications(notifications, contNotifications); }, () => { });
    setInterval(async function () {
        await sendPostData(urlManageNotifications, {getNumNotifications: true},(data) => {contNotifications = JSON.parse(data)}, () => {});
        await sendPostData(urlManageNotifications, { getNotifications: true }, (data) => { notifications = JSON.parse(data); drawNotifications(notifications, contNotifications); }, () => { });
    }, 3000);
});