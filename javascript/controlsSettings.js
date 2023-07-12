let nomeFotoProfilo, fotoProfilo;
let urlMod = window.location.href;

/**Funzione che prende 4 parametri (url, i dati in json da inviare, funzione nel caso vada a buon fine, funzione nel caso ci sia un errore) */
async function sendPostData(url, data, success, error){
    await $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        error: error,
    });
}

async function sendPhotoData(url, data, success, error){
    await $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        error: error,
        processData: false,
        contentType: false
    });
}

$('.submitInfoProfilo').on('click', async function () {

    let prevUsername = $('input[name="prevUsername"]').eq(0).val();
    let username = $('input[name="username"]').val();
    let email = $('input[name="email"]').val();
    let passwordNuovaPassword = $('input[name="passwordNuovaPassword"]').val();
    let passwordPrecedente = $('input[name="passwordPrecedente"]').val();
    let biografia = $('input[name="biografia"]').val();

    let data = {
        prevUsername: prevUsername,
        username: username,
        email: email,
        passwordNuovaPassword: passwordNuovaPassword,
        passwordPrecedente: passwordPrecedente,
        biografia: biografia,
    };

    if(fotoProfilo != undefined){
        let fd = new FormData();
        fd.append('fotoProfilo', fotoProfilo, nomeFotoProfilo);
        await sendPhotoData(urlMod, fd, () => {}, () => {alert("errore nella richiesta");});
    }
    else await sendPostData(urlMod, {noFotoProfilo: true}, () => {}, () => {alert("errore nella richiesta");});
    

    await sendPostData(urlMod, data, () => {window.location.href = urlMod;}, () => {alert("errore nella richiesta");});
});

$('.submitInfoPersonali').on('click', async function () {

    //con jquery non riesco a prendermi il valore delle select
    let annoRegistrazione = document.getElementsByClassName('annoRegistrazione')[0].value;
    let meseRegistrazione = document.getElementsByClassName('meseRegistrazione')[0].value;
    let giornoRegistrazione = document.getElementsByClassName('giornoRegistrazione')[0].value;

    let prevUsername2 = $('input[name="prevUsername"]').eq(1).val();
    let nome = $('input[name="nome"]').val();
    let cognome = $('input[name="cognome"]').val();
    let telefono = $('input[name="telefono"]').val();
    let nuovaData = annoRegistrazione + '-' + meseRegistrazione + '-' + giornoRegistrazione;
    let genereRegistrazione = document.getElementsByClassName('genereRegistrazione')[0].value;
    let passwordPrecedente = $('input[name="passwordPrecedente"]').eq(1).val();

    let data = {
        prevUsername2: prevUsername2,
        nome: nome,
        cognome: cognome,
        telefono: telefono,
        nuovaData: nuovaData,
        genereRegistrazione: genereRegistrazione,
        passwordPrecedente: passwordPrecedente,
    };

    await sendPostData(urlMod, data, () => {window.location.href = urlMod;}, () => {alert("errore nella richiesta");});

});


let $getFotoProfilo = null;
const $fileInput = $('<input>', {
    appendTo: 'body',
    accept: 'image/*',
    type: 'file',
    hidden: true,
    on: {
        change: function(e) {
        const F = e.target.files;
        if (!F || !F[0]) return;
        if (!(/^image\/(jpe?g|png)$/).test(F[0].type)) return message_reg3.css('display', 'block').html('Il&nbsp;file&nbsp;selezionato&nbsp;non&nbsp;è&nbsp;una&nbsp;foto.'); 
        $getFotoProfilo.one('load', e => URL.revokeObjectURL(e.target.src)).css({"width": '5em', "height": '5em', "border-radius": '50%', "object-fit": 'cover'}).prop('src', URL.createObjectURL(F[0]));
        fotoProfilo = F[0];
        nomeFotoProfilo = F[0].name;
        }
    }
});
$('.sectShow').each(function (i, item) {
    $(item).css('display', 'none');
});

//funzione che in base alla categoria scelta farà vedere le opzioni per quella categoria specifica
$('.opt').each(function(i, item){
    //in base al bottone cliccato mi prendo i valori dei campi da modificare e successivamente li metto in formato json e li invio al server
    $(item).on('click', async function(){
        $('.sectShowFirst').css('display', 'none');
        $('.sectShow').eq(i).css('display', 'block').siblings().css('display', 'none');
     });
});

//fuznione che prenderà e assegnera la nuova foto profilo
$('.nuovaFotoProfilo').eq(0).on('click', function() {
    $getFotoProfilo = $(this);
    $fileInput.click();
});

let pwd = $('input[name="passwordNuovaPassword"]').val();
$('input[name="passwordNuovaPassword"]').on('keyup', function() {
    let newPwd = $(this).val();
    if(pwd != newPwd) $('#passwordPrecedente').show(500);
    else $('#passwordPrecedente').hide(500);
});

$('.opt').click(function() {
    $(this).addClass('active').siblings().removeClass('active');
});

$('input[type="checkbox"]').on('change', function() {
    //manda la query per cambiare il valore dell'account privato
    $(this).is(":checked") ? sendPostData(urlMod, {AccountPrivato: true}, () => {}, () => {alert("errore nella richiesta");}) : sendPostData(urlMod, {AccountPrivato: false}, () => {}, () => {alert("errore nella richiesta");});
});