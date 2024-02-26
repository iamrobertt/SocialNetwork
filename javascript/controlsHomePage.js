let url = "https://necular.altervista.org/SocialNetwork/getData/getPeopleSearched.php";
let urlGetPost = "https://necular.altervista.org/SocialNetwork/getData/getDataPost.php";
let urlGetFeed = "https://necular.altervista.org/SocialNetwork/getData/getUserFeed.php";
let currentUrl = window.location.href;
let dataFeed;
let dataModal, commentiModal, likeModal, dataAzioniPost;
let commentiPostFeed;
let azioniPostBox;
let srcToCheck;

/**
 * 
 * 
 *  FUNZIONI GENERALI RIUTILIZZATE PIU VOLTE NEL CODICE
 * 
 * 
 */
function searchPerson() {
    let personaDaCercare = $('.searchInput').val();
    
    if (personaDaCercare != "") sendPostData(url, { personaDaCercare: personaDaCercare }, (data) => { data = JSON.parse(data); drawUsersSearched(data) }, () => { });
    else drawUsersSearched(undefined);
}

async function sendPostData(url, data, success, error) {
    await $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        error: error,
    });
}

async function sendGetData(url, success, error) {
    await $.ajax({
        type: "GET",
        url: url,
        success: success,
        error: error,
    });
}

function cancellaElementi(elemento) {
    while (elemento.children().length > 0) elemento.children().remove();
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

async function getModalData(src) {
    //mando al server tutti i dati necessari per creare la finestra in sovra impressione coi dettagli del post
    await sendPostData(urlGetPost, { getPostData: src }, (data) => { dataModal = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getCommenti: src }, (data) => { commentiModal = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getLike: src }, (data) => { likeModal = JSON.parse(data); }, () => { });
}

async function getAzioniPostData(src){
    await sendPostData(urlGetPost, { getLike: src }, (data) => { dataAzioniPost = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getNumCommenti: src }, (data) => { commentiPostFeed = JSON.parse(data); }, () => { });
}

async function drawModal(src) {
    await getModalData(src);
    drawModalPost(dataModal, commentiModal, likeModal);
}

async function insertComment(src, comment) {
    let data = {
        src: src,
        commento: comment
    }
                                                 //on success
    await sendPostData(currentUrl, data, async () => { await drawModal(src); openModal();}, () => { });
}
async function insertLike(src) {                                
    await sendPostData(currentUrl, { like: src }, async () => {}, () => { });
}

async function deleteLike(src) {                                
    await sendPostData(currentUrl, { deleteLike: src }, async () => {}, () => { });
}

function checkLikePerPost(checkLikePost) {
    if (checkLikePost == "1") return "./assets/already_like_icon.png";
    else return "./assets/like_icon.png";
}

async function getNumLikesPerPost(src){
    await sendPostData(urlGetPost, { getLike: src }, (data) => { likeModal = JSON.parse(data); }, () => { });
}

$(document).ready(async function () {
    await sendGetData(urlGetFeed, (data) => { data = JSON.parse(data); drawFeed(data); }, () => { });
});


/**
 * Sanitize a URL.
 *
 * Source @braintree/sanitize-url
 * <https://github.com/braintree/sanitize-url>
 *
 * @param {string} url
 * @return {string}
 */
function sanitizeUrl(url) {
    if (!url) {
        return "about:blank";
    }
 
    var invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im;
    var ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim;
    var urlSchemeRegex = /^([^:]+):/gm;
    var relativeFirstCharacters = [".", "/"];
 
    function _isRelativeUrlWithoutProtocol(url) {
        return relativeFirstCharacters.indexOf(url[0]) > -1;
    }
 
    var sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim();
    if (_isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
    }
 
    var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
    if (!urlSchemeParseResults) {
        return sanitizedUrl;
    }
 
    var urlScheme = urlSchemeParseResults[0];
    if (invalidProtocolRegex.test(urlScheme)) {
        return "about:blank";
    }
 
    return sanitizedUrl;
}

/**
 * 
 * EVENT LISTENER PER ESEUIRE AZIONI IN BASE A DEGLIE EVENTI PRESTABILITI(QUELLI SOTTO)
 * 
 * 
 * 
 */

$(document).on('click', '.utenteCercato', function () {
    let username = $(this).find('p').text();

    let urlRedirect = `https://necular.altervista.org/SocialNetwork/profile.php?username=${username}`;
    let sanUrl = sanitizeUrl(urlRedirect);

    window.location.href = sanUrl;
});

$(document).on('click', '.fotoPostFeed', async function () {
    //visto che il percorso è univoco prendo quello come valore di riferimento
    let src = $(this).attr('src').replace('./postImages/', '');
    await drawModal(src);
    openModal();
});

//da vedere se funzia
$(document).on('click', '.chiudiModal', '.overlay.active', async function () {
    closeModal();
});

$(document).on('click', '.btnAggiungiCommento', async function () {
    //prendo il nome dell'immagine per poter mandare i dati al server che farà le query restituendomi i dati
    let src = $(this).parent().parent().prev().attr('src').replace("./postImages/", "");

    let commento = $(this).prev().val();
    //prendo il nome dell'immagine e vedo a quale post appartiene per modificare i dati anche sul feed
    let postTarget = $(`img[src$="${src}"]`).index('.fotoPostFeed');
    await insertComment(src, commento);

    //aggiorno i contatori anche sul feed
    await getAzioniPostData(src);
    drawAzioniBox($('.azioniPost').eq(postTarget), dataAzioniPost, commentiPostFeed);
});

$(document).on('click', '.fotoLike', async function () {

    //prendo il nome dell'immagine per poter mandare i dati al server che farà le query restituendomi i dati
    let src = $(this).parent().prev().attr('src').replace("./postImages/", "");
    let srcImgLike = $(this).attr('src');
    //prendo il nome dell'immagine e vedo a quale post appartiene per modificare i dati anche sul feed
    let postTarget = $(`img[src$="${src}"]`).index('.fotoPostFeed');

    //controllo se l'utente ha gia messo like al post
    let checkLikePost;
    await getAzioniPostData(src);
    $.each(dataAzioniPost , function (i, data) {
        checkLikePost = data.check_like_post;
    });

    let imgSrc = checkLikePerPost(checkLikePost);
    if (imgSrc == "./assets/already_like_icon.png"){
        await deleteLike(src);
        //aggiorno il contatore sul modal
        await drawModal(src);
        //aggiorno il contatore anche sul feed
        await getAzioniPostData(src);
        drawAzioniBox($('.azioniPost').eq(postTarget), dataAzioniPost, commentiPostFeed);
    }
    else {
        await insertLike(src);
        //aggiorno il contatore sul modal
        await drawModal(src);
        //aggiorno il contatore anche sul feed
        await getAzioniPostData(src);
        drawAzioniBox($('.azioniPost').eq(postTarget), dataAzioniPost, commentiPostFeed);
    }
    
});

$(document).on('click', '.fotoLikeAz', async function () {

    //prendo il nome dell'immagine per poter mandare i dati al server che farà le query restituendomi i dati
    let src = $(this).parent().parent().prev().attr('src').replace("./postImages/", "");

    let srcImgLike = $(this).attr('src');
    let azioniPost = $(this).parent().parent();

    if (srcImgLike == "./assets/already_like_icon.png") {
        await deleteLike(src);
        await getAzioniPostData(src);
        drawAzioniBox(azioniPost, dataAzioniPost, commentiPostFeed);
    }
    else {
        await insertLike(src);
        await getAzioniPostData(src);
        drawAzioniBox(azioniPost, dataAzioniPost, commentiPostFeed);
    }
});

$(document).on('click', '.fotoCommentoAz', async function () {
    //visto che il percorso è univoco prendo quello come valore di riferimento
    let src = $(this).parent().parent().prev().attr('src').replace('./postImages/', '');
    await drawModal(src);
    openModal();
});


/**
 * 
 * 
 * FUNZIONI VOLTE ALLA STAMPA VERA E PROPRIA E SCHERMO DEGLI ELEMENTI DINAMICI
 * 
 * 
 * 
 */
//funzione che una volta presi i dati stamperà tutti gli utenti che trova (da implementare poi un controllo che cerca un numero limitato di persone)
function drawUsersSearched(dataUtenti) {
    let searchusersBoxInner = $('.searchUsersBoxInner');
    let usernames = [];
    let pathFotoProfilos = [];
    let biografie = [];

    if (dataUtenti == undefined) {
        cancellaElementi(searchusersBoxInner);
        return;
    }

    //elimino tutti i "figli" presenti dentro la div con classe searchUsersBoxInnerInner
    cancellaElementi(searchusersBoxInner);

    //itero tutti gli elementi dentro dataUtenti e li inserisco nei rispettivi array per poi poterli usare dopo per stampare utti i dati
    $.each(dataUtenti, function (i, data) {
        usernames.push(data.username);
        pathFotoProfilos.push(data.pathFotoProfilo);
        biografie.push(data.biografia);
    });

    //controllo tutte le biografie e vedo se hanno piu di 17 caratteri, nel caso stampo solo i primi 20 e aggiungo 3 puntini
    for (let i = 0; i < biografie.length; i++) if (biografie[i].length > 20) biografie[i] = biografie[i].substring(0, 20) + "...";

    //se non trova nessun utente stampo il messaggio di errore, altrimenti
    //ciclo un array (tanto hanno tutti la stessa lunghezza) e stampo tutti gli utenti trovati
    if (usernames.length == 0) searchusersBoxInner.append('<p><br><br>Non ci sono risultati per la tua ricerca.</p>');
    else for (let i = 0; i < usernames.length; i++) searchusersBoxInner.append(`<div class='utenteCercato'> <img class='fotoProfiloCercato' src='./profileImages/${pathFotoProfilos[i]}' alt=''> <div class='utenteDettagli'> <p>${usernames[i]}</p> <div class="biografia-p">${biografie[i]}</div> <hr></div>`);
}

async function drawFeed(dataFeedJson) {

    let feedBoxInner = $('.feedBoxInner');
    let fotoProfilo = [], username = [], dataEOra = [], fotoPost = [], descrizionePosts = [], likes = [], commenti = [], checkLike = [];

    if (dataFeedJson == undefined) return;

    //elimino tutti i "figli" presenti dentro la div
    cancellaElementi(feedBoxInner);

    //loopo ogni elemento json e mi prendo i dati del post salvando tutto in 3 array
    $.each(dataFeedJson, function (i, data) {
        fotoProfilo.push(data.pathFotoProfilo);
        username.push(data.usernameSeguito);
        dataEOra.push(data.dataPostFeed);
        fotoPost.push(data.pathFotoFeed);
        descrizionePosts.push(data.descrizioneFeed);
        commenti.push(data.contCommentiFeed);
    });

    //se non trova nessun utente stampo il messaggio di errore, altrimenti
    //ciclo un array (tanto hanno tutti la stessa lunghezza) e stampo tutti gli utenti trovati
    if (username.length == 0) feedBoxInner.append('<h6><br><br>Non hai un feed, comincia a seguire qualcuno.</h6>');
    else for (let i = 0; i < username.length; i++) {
        await getNumLikesPerPost(fotoPost[i]);

        $.each(likeModal, function (i, data) {
            checkLike.push(data.check_like_post);
            likes.push(data.like_post);
        });

        let imgSrc = checkLikePerPost(checkLike[i]);
        appendToFeedBox(feedBoxInner, fotoProfilo[i], username[i], dataEOra[i], descrizionePosts[i], fotoPost[i], imgSrc, likes[i], commenti[i]);
    }
}

function drawModalPost(dataModalPost, dataModalCommenti, likeModal) {

    //dati per query del post
    let modalPost = $('.modalPostBody');
    let username, dataPost, descrizionePost, fotoPost, fotoProfilo, likeposts, checkLikePost;
    //dati per queri per i commenti
    let commentiBox = $("<div class='commentiBox'></div>");
    let usernameCommento = [], dataCommento = [], descrizioneCommento = [], fotoProfiloCommento = [];

    cancellaElementi(modalPost);

    $.each(dataModalCommenti, function (i, data) {
        usernameCommento.push(data.username_commento);
        dataCommento.push(data.data_commento);
        descrizioneCommento.push(data.descrizione_commento);
        fotoProfiloCommento.push(data.foto_profilo);
    });

    //da mettere anche data del commento sotto
    for (let i = 0; i < usernameCommento.length; i++) appendToCommentiBox(commentiBox, fotoProfiloCommento[i], usernameCommento[i], descrizioneCommento[i]);

    //dati per query per i like
    $.each(likeModal, function (i, data) {
        likeposts = data.like_post;
        checkLikePost = data.check_like_post;
    });

    let imgSrc = checkLikePerPost(checkLikePost);

    $.each(dataModalPost, function (i, data) {
        username = data.username_post;
        dataPost = data.data_post;
        descrizionePost = data.descrizione_post;
        fotoPost = data.src;
        fotoProfilo = data.foto_profilo;
    });

    appendToModalPost(modalPost, fotoPost, fotoProfilo, username, dataPost, imgSrc, likeposts, descrizionePost, commentiBox);
}

function drawAzioniBox(azioniPost, dataAzioniPost, commentiAzioniPost) {
    let likespost,  checkLikePost, commentsPost;

    $.each(dataAzioniPost, function (i, data) {
        likespost = data.like_post;
        checkLikePost = data.check_like_post;
    });

    $.each(commentiAzioniPost, function (i, data) {
        commentsPost = data.cont_commenti;
    });

    cancellaElementi(azioniPost);

    let imgSrc = checkLikePerPost(checkLikePost);

    appendToAzioniBox(azioniPost, imgSrc, likespost, commentsPost);
}

$('.searchInput').keyup(searchPerson);


/**
 * 
 * 
 *  FUNZIONI VOLTE ALLA DEFINIZIONE DELLA STRUTTURA DEGLI ELEMENTI DINAMICI
 *  CHE VERRANO STAMPATI A VIDEO
 * 
 * 
 * 
 */

function appendToFeedBox(feedBoxInner, fotoProfilo, username, dataEOra, descrizionePost, fotoPost, imgSrc, like, commenti) {
    feedBoxInner.append(`
    <div class="postBox">
        <img class="fotoProfiloFeed" src="./profileImages/${fotoProfilo}" alt="">
        <div class="headerPostFeed">
            <p class="usernameProfiloFeed">${username}<p>
            <span class="dataPost">${dataEOra}</span>
            <br>
        </div>
        <div class="descrizioneFeedPost">
            <p>${descrizionePost}</p>
        </div>

        <img class="fotoPostFeed" src="./postImages/${fotoPost}" alt="">

        <div class="azioniPost">
            <div class="likePost">
                <img class="fotoLikeAz" src="${imgSrc}" alt=""> 
                <span class="spanLikePost">${like}</span> 
            </div>
            <div class="commentPost"> 
                <img class="fotoCommentoAz" src="./assets/comment_icon.png" alt=""> 
                <span>${commenti}</span> 
            </div>
        </div>
        <hr>
    </div>`
);
}

function appendToModalPost(modalPost, fotoPost, fotoProfilo, username, dataEOra, imgSrc, likes, descrizionePost, commentiBox){
    modalPost.append(`
    <img class="imgPost" src="./postImages/${fotoPost}" alt="">
    <div class="postData">
        <button class="chiudiModal">&times;</button>
        <img class="fotoProfiloModal" src="./profileImages/${fotoProfilo}" alt="">
        <div class="headerPostData">
            <h1>${username}</h1>
            <br>
            <span class="dataPost">${dataEOra}</span>
            <br>
        </div>
            <img class="fotoLike" src="${imgSrc}"></img>
            <span class="likePost">${likes}</span>
        <div class="descrizioneModalPost">
            <p>${descrizionePost}</p>
        </div>
        <div class="aggiungiCommento">
            <textarea name="aggiungiCommento"rows="2" placeholder="Aggiungi un commento..."></textarea>
            <button style="margin-top: 2%;" class="btnAggiungiCommento">Aggiungi commento</button>
        </div>
        ${commentiBox.html()}
    </div>
    `);
}

function appendToCommentiBox(commentiBox, fotoProfilo, username, descrizioneCommento){
    commentiBox.append(`
    <div class="commento">
        <img class="fotoProfiloCommento" src="./profileImages/${fotoProfilo}" alt="">
        <div class="commentoDettagli">
            <p>${username}</p>
            <span>${descrizioneCommento}</span>
        </div>
        <hr>
    </div>`);
}

function appendToAzioniBox(azioniPost, imgSrc, likes, commenti){
    azioniPost.append(`
    <div class="likePost"> 
        <img class="fotoLikeAz" src="${imgSrc}" alt=""> 
        <span class="spanLikePost">${likes}</span> 
    </div>
    <div class="commentPost"> 
        <img class="fotoCommentoAz" src="./assets/comment_icon.png" alt="">
        <span>${commenti}</span>
    </div>
    `);
}