/**Url base che servirà sia per loggare che per registrare */
let url = "https://necular.altervista.org/SocialNetwork/index.php";
let urlInsUser = "https://necular.altervista.org/SocialNetwork/getData/insertedUser.php";
let urlCheck = "https://necular.altervista.org/SocialNetwork/getData/checkData.php";
let message_reg1 = $('.message_reg1');
let message_reg2 = $('.message_reg2');
let message_reg3 = $('.message_reg3');
let message_success_reg = $('.message_success_reg');
let nomeFotoProfilo, fotoProfilo;
let service_id = "service_aik4zky";
let template_id = "template_lqnjs46";
let user_id = "oLpc_D0KUqrG2Z5ks";
let toEmail, msgMail, toName;
let data = {};
let isUSerInsertedCorrectly;

function replaceWithNbps(str){
    return str.replace(/ /g, '&nbsp;');
}
function replaceWithWhiteSpace(str){
    return str.replace(/&nbsp;/g, ' ');
}

//una volta che la pagina è completamente carica inizializzo emailjs che mi servirà per mandare le email
window.onload = (event) => {
    emailjs.init(user_id);
};


function validateEmail(email){
    var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validEmail.test(email);
}

//funzione che si prende l'email del destinatario e attraverso altri campi (service_id, template_id, user_id) invia una email
async function sendEmail(_toEmail, messageMail, _toName, _service_id, _template_id, _user_id) {

    var templateParams = {
        reply_to: _toEmail,
        from_name: "PakiRom",
        message: messageMail,
        to_name: _toName
    }

    //se l'email va a buon fine ricarica la pagina.
    //l'ho messo qui perche ci vuole un po' di tempo per mandare l'email
    //se mettessi il reload della pagina sulla post per mandare la conferma l'email non si manderebbe in tempo
    let responseText = "";
    await emailjs.send(_service_id, _template_id, templateParams, _user_id)
        .then(function(response) {
            responseText = response.text;
        });

    return responseText;
}

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

function openModal() {
    $('.modalPost').addClass('active');
    $('.overlay').addClass('active');
    $('body').css('overflow', 'hidden');
}

function closeModal() {
    $('.modalPost').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').css('overflow', 'auto');
}

/**Funzione che prende il valore di tutti i campi nella prima parte della registrazione, li controlla per renderli validi e li invia tramite post al file php che li salverà come variabili di sessione */
async function checkRegister1(){

    let nomeRegistrazione = $('.nomeRegistrazione').eq(1).val();
    let cognomeRegistrazione = $('.cognomeRegistrazione').eq(1).val();
    let emailRegistrazione = $('.emailRegistrazione').eq(1).val();
    let passwordRegistrazione = $('.passwordRegistrazione').eq(1).val();
    let passwordRegistrazioneConferma = $('.passwordRegistrazioneConferma').eq(1).val();
    let esisteEmail;
    toEmail = emailRegistrazione;

    /**Se uno dei campi obbligatori è vuoto stampo l'errore */
    if(nomeRegistrazione == '' || cognomeRegistrazione == '' || emailRegistrazione == '' || passwordRegistrazione == '' || passwordRegistrazioneConferma == '') {
        message_reg1.css('display', 'block');
        message_reg1.html('Compila tutti i campi obbligatori (*).');
        return;
    }
    /**Se le password inserite non coincidono stampo l'errore */
    else if(passwordRegistrazione != passwordRegistrazioneConferma){
        message_reg1.css('display', 'block');
        message_reg1.html('Le password non coincidono.');
        return;
    }
    /**Se la password è minore di 8 caratteri o maggiore di 20 stampo l'errore */
    else if(passwordRegistrazione.length < 8 || passwordRegistrazione.length > 20){
        message_reg1.css('display', 'block');
        message_reg1.html('La password deve essere compresa tra 8 e 20 caratteri. (Attualmente ne stai usando ' + passwordRegistrazione.length + ').');
        return;
    }

    await sendPostData(urlCheck, {emailRegistrazione: emailRegistrazione}, function(data) { data = JSON.parse(data); esisteEmail = data.esisteEmail;}, () => {alert("errore nella richiesta");});
    let isEmailValid = validateEmail(emailRegistrazione);

    if(esisteEmail || !isEmailValid){
        message_reg1.css('display', 'block');
        message_reg1.html('E-mail non corretta o già esistente.');
        return;
    }

    /*nascondo il messaggio di errore*/
    message_reg1.css('display', 'none');
    
    let dataReg1 = {
        nomeRegistrazione: nomeRegistrazione,
        cognomeRegistrazione: cognomeRegistrazione,
        emailRegistrazione: emailRegistrazione,
        passwordRegistrazione: passwordRegistrazione,
    };

    Object.assign(data, dataReg1);

    /**Sostituisco gli spazi delle stringhe con &nbps; per rendere animazioni più fluide */
    $('h2').eq(0).html(replaceWithNbps($('h2').eq(0).html()));
    message_reg1.html(replaceWithNbps(message_reg1.html()));
    /**Mando i dati al server */
    $(".register1Box").hide(1000, function () { 
        $(".register2Box").show(1000, function(){ 
            $('h2').eq(1).html(replaceWithWhiteSpace($('h2').eq(1).html()));
        });
    });
}


/**Funzione che prende il valore di tutti i campi nella seconda parte della registrazione, li controlla per renderli validi e li invia tramite post al file php che li salverà come variabili di sessione */
async function checkRegister2(){
    
    let telefonoRegistrazione = $('.telefonoRegistrazione').eq(1).val();
    let annoRegistrazione = $('.annoRegistrazione').val();
    let meseRegistrazione = $('.meseRegistrazione').val();
    let giornoRegistrazione = $('.giornoRegistrazione').val();
    let genereRegistrazione = $('.genereRegistrazione').val();
    let esisteTelefono;

    /**Se uno dei campi obbligatori è vuoto stampo l'errore */
    if(annoRegistrazione == null || meseRegistrazione == null || giornoRegistrazione == null || genereRegistrazione == null) {
        message_reg2.css('display', 'block');
        message_reg2.html('Compila tutti i campi obbligatori (*).');
        return;
    }
    else if($('.telefonoRegistrazione').eq(1).val().length != 0 && $('.telefonoRegistrazione').eq(1).val().length != 10){
        message_reg2.css('display', 'block');
        message_reg2.html('Il numero di telefono inserito non è valido.');
        return;
    }
    await sendPostData(urlCheck, {telefonoRegistrazione: telefonoRegistrazione}, function(data) { data = JSON.parse(data); esisteTelefono = data.esisteTelefono;}, () => {alert("errore nella richiesta");})
    
    if(esisteTelefono) {
        message_reg2.css('display', 'block');
        message_reg2.html('Telefono già esistente.');
        return;
    }

    try{
        parseInt(telefonoRegistrazione);
    }
    catch(e){
        message_reg2.css('display', 'block');
        message_reg2.html('Il numero di telefono inserito non è valido.');
        return;
    }
    
    /*nascondo il messaggio di errore*/
    message_reg2.css('display', 'none');

    /**Creo la data dall'unione dei 3 parametri nel formato giusto per sql */
    let dataRegistrazione = annoRegistrazione + '/' + meseRegistrazione + '/' + giornoRegistrazione;

    let dataReg2 = {
        telefonoRegistrazione: telefonoRegistrazione,
        dataRegistrazione: dataRegistrazione,
        genereRegistrazione: genereRegistrazione
    };
    
    Object.assign(data, dataReg2);
    /**Sostituisco gli spazi delle stringhe con &nbps; per rendere animazioni più fluide */
    $('h2').eq(1).html(replaceWithNbps($('h2').eq(1).html()));
    message_reg2.html(replaceWithNbps(message_reg2.html()));

    /**Mando i dati al server */
    $(".register2Box").hide(1000, function () {
        $(".register3Box").show(1000, function(){ 
                $('h2').eq(2).html(replaceWithWhiteSpace($('h2').eq(2).html()));
            }); 
        });
}

/**Funzione che prende il valore di tutti i campi nella terza parte della registrazione, li controlla per renderli validi e li invia tramite post al file php che li salverà come variabili di sessione */
async function sendAllData() {

    //da sanificare valori dentro data (meglio se fatto per ogni registerBox)
    
    let usernameProfilo = $('.usernameProfilo').val();
    let biografiaProfilo = $('.biografiaProfilo').val();
    // let pathFotoProfilo = "https://necular.altervista.org/SocialNetwork/profileImages";
    let esisteUsername;
    toName = usernameProfilo;

    /**Se uno dei campi obbligatori è vuoto stampo l'errore */
    if(usernameProfilo == ''){
        message_reg3.css('display', 'block');
        message_reg3.html('Compila tutti i campi obbligatori (*).');
        return;
    }

    await sendPostData(urlCheck, {usernameProfilo: usernameProfilo}, function(data) { data = JSON.parse(data); esisteUsername = data.esisteUsername;}, () => {alert("errore nella richiesta");})
    /*nascondo il messaggio di errore*/
    if(esisteUsername){
        message_reg3.css('display', 'block');
        message_reg3.html('Username già esistente.');
        return;
    }

    if(nomeFotoProfilo == '') nomeFotoProfilo = "default_user_icon.png";

    message_reg3.css('display', 'none');

    let dataReg3 = {
        usernameProfilo: usernameProfilo,
        biografiaProfilo: biografiaProfilo,
        nomeFotoProfilo: nomeFotoProfilo,
    };

    Object.assign(data, dataReg3);

    //mando la foto
    let fd = new FormData();
    fd.append('fotoProfilo', fotoProfilo);
    await sendPhotoData(urlInsUser, fd, () => {}, () => {alert("errore nella richiesta per l'invio della foto profilo");});
    fd.delete('fotoProfilo');

    //mando tutti i dati e registro l'utente
    await sendPostData(urlInsUser, data, (data) => {data = JSON.parse(data); isUSerInsertedCorrectly = data.inseritoCorrettamente} , () => {alert("errore nella richiesta");});
    /**Sostituisco gli spazi delle stringhe con &nbps; per rendere animazioni più fluide */
    
    $('h2').eq(2).html(replaceWithNbps($('h2').eq(2).html()));
    message_reg3.html(replaceWithNbps(message_reg3.html()));


    //nel caso vada tutto a buon fine
    /**Mando i dati al server */
    if(isUSerInsertedCorrectly){
        $(".register3Box").hide(1000, function () { $(".loginBox").show(1000); });
        message_success_reg.css('display','block')
        .html("Registrazione&nbsp;completata&nbsp;con&nbsp;successo.<br>Conferma&nbsp;l'indirizzo&nbsp;email&nbsp;ed&nbsp;inizia&nbsp;ad&nbsp;usarela&nbsp;nostra&nbsp;app!");

        let urlMail = "https://necular.altervista.org/SocialNetwork/getData/getMsgMail.php";
        await sendPostData(urlMail, {emailEmail: toEmail}, async (data) => {msgMail = data; await sendEmail(toEmail, msgMail, toName, service_id, template_id, user_id); }, () => {alert("errore nella richiesta per l'invio dell'email");});
    }

    else message_reg3.css('display', 'block').html("Errore&nbsp;nella&nbsp;registrazione.&nbsp;Riprova&nbsp;e&nbsp;se&nbsp;il&nbsp;problema&nbsp;persiste&nbsp;contattaci.");
}

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
        $getFotoProfilo.one('load', e => URL.revokeObjectURL(e.target.src)).css({"width": '3.5em', "height": '3.5em', "border-radius": '50%', "object-fit": 'cover'}).prop('src', URL.createObjectURL(F[0]));
        fotoProfilo = F[0];
        nomeFotoProfilo = F[0].name;
        }
    }
});

$('.fotoProfilo').eq(0).on('click', function() {
    $getFotoProfilo = $(this);
    $fileInput.click();
});

$('.passwordDimenticata').on('click', function() {
    openModal();
});

$(document).on('click', '.chiudiModal', '.overlay.active', async function () {
    closeModal();
});

const delay = ms => new Promise(res => setTimeout(res, ms));

$('.inviaEmailReset').on('click', async function() {
    let email = $('.emailPasswordDimenticata').val();
    if(!validateEmail(email)) {
        $('.message_resetEmail').css('display', 'block').html('Inserisci un indirizzo email valido.');
        return;
    }

    let templateRecoverEmail = "template_zem67dh";
    $('.message_resetEmail').css('display', 'none');
    let toName = "";
    let msgMail = "";
    let response = await sendEmail(email, msgMail, toName, service_id, templateRecoverEmail, user_id);
    if(response == "OK") {
        $('.message_resetEmail').removeClass('alert alert-danger').addClass('alert alert-success').css('display', 'block').html('Email&nbsp;inviata&nbsp;con&nbsp;successo.');
        await delay(3000);
        closeModal();
    }
    else{
        if($('.message_resetEmail').hasClass('alert alert-danger')) $('.message_resetEmail').html("Errore&nbsp;nell'invio&nbsp;della&nbsp;email.&nbsp;Riprova.");
        else $('.message_resetEmail').removeClass('alert alert-success').addClass('alert alert-danger').css('display', 'block').html("Errore&nbsp;nell'invio&nbsp;della&nbsp;email.&nbsp;Riprova.");
    }
    
});


