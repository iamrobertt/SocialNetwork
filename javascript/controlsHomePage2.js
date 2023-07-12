let url = "https://necular.altervista.org/SocialNetwork/getData/getPeopleSearched.php";
let urlGetPost = "https://necular.altervista.org/SocialNetwork/getData/getDataPost.php";
let currentUrl = window.location.href;
let dataFeed;
let dataModal, commentiModal, likeModal, dataAzioniPost;
let commentiPostFeed;

function searchPerson() {
    let personaDaCercare = $('.searchInput').val();
    if (personaDaCercare != "") sendPostData(url, { personaDaCercare: personaDaCercare }, (data) => { data = JSON.parse(data); drawUsersSearched(data) }, () => { });
    else drawUsersSearched(undefined);
}

function drawAzioniBox(azioniPost, dataAzioniPost, commentiAzioniPost) {
    let likeposts = [];
    let checkLikePost = [];
    let commentsPost = [];

    $.each(dataAzioniPost, function (i, data) {
        likeposts.push(data.like_post);
        checkLikePost.push(data.check_like_post);
    });

    $.each(commentiAzioniPost, function (i, data) {
        commentsPost.push(data.cont_commenti);
    });

    let likeImgSrc;

    cancellaElementi(azioniPost);

    if (checkLikePost == "1") likeImgSrc = "./assets/already_like_icon.png";
    else likeImgSrc = "./assets/like_icon.png";

    azioniPost.append(`
    <div class="likePost"> 
        <img class="fotoLikeAz" src="${likeImgSrc}" alt=""> 
        <span class="spanLikePost">${likeposts}</span> 
    </div>
    <div class="commentPost"> 
        <img class="fotoCommentoAz" src="./assets/comment_icon.png" alt="">
        <span>${commentsPost}</span>
    </div>`
    );
}

//funzione che una volta presi i dati stamperà tutti gli utenti che trova (da implementare poi un controllo che cerca un numero limitato di persone)
function drawUsersSearched(dataUtenti) {
    let searchusersBoxInner = $('.searchUsersBoxInner');
    let usernames = [];
    let pathFotoProfilos = [];
    let biografie = [];

    if (dataUtenti == undefined) {
        while (searchusersBoxInner.children().length > 0) searchusersBoxInner.children().remove();
        return;
    }

    //elimino tutti i "figli" presenti dentro la div con classe searchUsersBoxInnerInner
    while (searchusersBoxInner.children().length > 0) searchusersBoxInner.children().remove();

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

$(document).on('click', '.utenteCercato', function () {
    let username = $(this).find('p').text();
    window.location.href = `https://necular.altervista.org/SocialNetwork/profile.php?username=${username}`;
});

async function drawFeed(dataFeedJson) {
    let feedBoxInner = $('.feedBoxInner');
    let pathFotoProfilos = [];
    let usernameUtentes = [];
    let dateTimePosts = [];
    let pathFotoPosts = [];
    let descrizionePosts = [];
    let likesFeed = [];
    let commentsFeed = [];
    let checkLikefeed = [];

    if (dataFeedJson == undefined) {
        cancellaElementi(feedBoxInner);
        return;
    }

    //elimino tutti i "figli" presenti dentro la div
    cancellaElementi(feedBoxInner);

    //loopo ogni elemento json e mi prendo i dati del post salvando tutto in 3 array
    $.each(dataFeedJson, function (i, data) {
        pathFotoProfilos.push(data.pathFotoProfilo);
        usernameUtentes.push(data.usernameSeguito);
        dateTimePosts.push(data.dataPostFeed);
        pathFotoPosts.push(data.pathFotoFeed);
        descrizionePosts.push(data.descrizioneFeed);
        commentsFeed.push(data.contCommentiFeed);
    });

    let imgSrc;
    //se non trova nessun utente stampo il messaggio di errore, altrimenti
    //ciclo un array (tanto hanno tutti la stessa lunghezza) e stampo tutti gli utenti trovati
    if (usernameUtentes.length == 0) feedBoxInner.append('<h6><br><br>Non hai un feed, comincia a seguire qualcuno.</h6>');
    else for (let i = 0; i < usernameUtentes.length; i++) {
        await sendPostData(urlGetPost, { getLike: pathFotoPosts[i] }, (data) => { likeModal = JSON.parse(data); }, () => { });
        $.each(likeModal, function (i, data) {
            checkLikefeed.push(data.check_like_post);
            likesFeed.push(data.like_post);
        });

        if (checkLikefeed[i] == "1") imgSrc = "./assets/already_like_icon.png";
        else imgSrc = "./assets/like_icon.png";

        feedBoxInner.append(`<div class="postBox">
    <img class="fotoProfiloFeed" src="./profileImages/${pathFotoProfilos[i]}" alt="">
    <div class="headerPostFeed">
        <p class="usernameProfiloFeed">${usernameUtentes[i]}<p>
        <span class="dataPost">${dateTimePosts[i]}</span>
        <br>
    </div>
    <div class="descrizioneFeedPost">
        <p>${descrizionePosts[i]}</p>
    </div>
    <img class="fotoPostFeed" src="./postImages/${pathFotoPosts[i]}" alt="">

    <div class="azioniPost">
        <div class="likePost">
            <img class="fotoLikeAz" src="${imgSrc}" alt=""> 
            <span class="spanLikePost">${likesFeed[i]}</span> 
        </div>
        <div class="commentPost"> 
            <img class="fotoCommentoAz" src="./assets/comment_icon.png" alt=""> 
            <span>${commentsFeed[i]}</span> 
        </div>
    </div>
    <hr>
</div>`);
    }

}
//prendere il feed del'utente
$(document).ready(function () {
    fetch("https://necular.altervista.org/SocialNetwork/getData/getUserFeed.php")
        .then(res => res.json())
        .then(data => {
            dataFeed = data;
            drawFeed(data);
        });
});

//finestra a comparsa coi dettagli del post
$(document).on('click', '.fotoPostFeed', async function () {
    //visto che il percorso è univoco prendo quello come valore di riferimento
    let src = $(this).attr('src');
    src = src.replace('./postImages/', '');

    //mando al server tutti i dati necessari per creare la finestra in sovra impressione coi dettagli del post
    await sendPostData(urlGetPost, { getPostData: src }, (data) => { dataModal = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getCommenti: src }, (data) => { commentiModal = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getLike: src }, (data) => { likeModal = JSON.parse(data); }, () => { });

    drawModalPost(dataModal, commentiModal, likeModal);

    $('.modalPost').addClass('active');
    $('.overlay').addClass('active');
    $('body').css('overflow', 'hidden');
});

$(document).on('click', '.chiudiModal', function () {
    $('.modalPost').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').css('overflow', 'auto');
});

$(document).on('click', '.overlay.active', function () {
    $('.modalPost').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').css('overflow', 'auto');
});

function drawModalPost(dataModalPost, dataModalCommenti, likeModal) {

    //dati per query del post
    let modalPost = $('.modalPostBody');
    let username;
    let dataPost;
    let descrizionePost;
    let src;
    let foto_profilo;

    cancellaElementi(modalPost);

    $.each(dataModalPost, function (i, data) {
        username = data.username_post;
        dataPost = data.data_post;
        descrizionePost = data.descrizione_post;
        src = data.src;
        foto_profilo = data.foto_profilo;
    });

    if (username == "" || dataPost == "" || src == "") return;


    //dati per queri per i commenti
    let commentiBox = $("<div class='commentiBox'></div>");
    let usernameCommento = [];
    let dataCommento = [];
    let descrizioneCommento = [];
    let fotoProfiloCommento = [];

    $.each(dataModalCommenti, function (i, data) {
        usernameCommento.push(data.username_commento);
        dataCommento.push(data.data_commento);
        descrizioneCommento.push(data.descrizione_commento);
        fotoProfiloCommento.push(data.foto_profilo);
    });

    let likeposts = [];
    let checkLikePost = [];
    //dati per query per i like
    $.each(likeModal, function (i, data) {
        likeposts.push(data.like_post);
        checkLikePost.push(data.check_like_post);
    });

    let likeImgSrc;

    if (checkLikePost == "1") likeImgSrc = "./assets/already_like_icon.png";
    else likeImgSrc = "./assets/like_icon.png";

    for (let i = 0; i < usernameCommento.length; i++) commentiBox.append(`<div class="commento">
        <img class="fotoProfiloCommento" src="./profileImages/${fotoProfiloCommento[i]}" alt="">
        <div class="commentoDettagli">
            <p>${usernameCommento[i]}</p>
            <span>${descrizioneCommento[i]}</span>
        </div>
        <hr>
    </div>`);

    modalPost.append(`<img class="imgPost" src="./postImages/${src}" alt="">
    <div class="postData">
        <button class="chiudiModal">&times;</button>
        <img class="fotoProfiloModal" src="./profileImages/${foto_profilo}" alt="">
        <div class="headerPostData">
            <h1>${username}</h1>
            <br>
            <span class="dataPost">${dataPost}</span>
            <br>
        </div>
            <img class="fotoLike" src="${likeImgSrc}"></img>
            <span class="likePost">${likeposts}</span>
        <div class="descrizioneModalPost">
            <p>${descrizionePost}</p>
        </div>
        <div class="aggiungiCommento">
            <textarea name="aggiungiCommento"rows="2" placeholder="Aggiungi un commento..."></textarea>
            <button style="margin-top: 2%;" class="btnAggiungiCommento">Aggiungi commento</button>
        </div>
        ${commentiBox.html()}
        
    </div>`);


}

$(document).on('click', '.btnAggiungiCommento', async function () {
    let commento = $(this).prev().val();
    let src = $(this).parent().parent().prev().attr('src').replace("./postImages/", "");

    let data = {
        commento: commento,
        src: src
    }
    await sendPostData(currentUrl, data, async () => {
        await sendPostData(urlGetPost, { getPostData: src }, (data) => { dataModal = JSON.parse(data); }, () => { });
        await sendPostData(urlGetPost, { getCommenti: src }, (data) => { commentiModal = JSON.parse(data); }, () => { });
        drawModalPost(dataModal, commentiModal, likeModal);
    }, () => { });
});

$(document).on('click', '.fotoLike', async function () {

    let src = $(this).parent().prev().attr('src').replace("./postImages/", "");
    let srcImgLike = $(this).attr('src');

    if (srcImgLike == "./assets/already_like_icon.png") {
        await sendPostData(currentUrl, { deleteLike: src }, async () => {
            await sendPostData(urlGetPost, { getPostData: src }, (data) => { dataModal = JSON.parse(data); }, () => { });
            await sendPostData(urlGetPost, { getLike: src }, (data) => { likeModal = JSON.parse(data); }, () => { });
            drawModalPost(dataModal, commentiModal, likeModal);
        }, () => { });
    }
    else await sendPostData(currentUrl, { like: src }, async () => {
        await sendPostData(urlGetPost, { getPostData: src }, (data) => { dataModal = JSON.parse(data); }, () => { });
        await sendPostData(urlGetPost, { getLike: src }, (data) => { likeModal = JSON.parse(data); }, () => { });
        drawModalPost(dataModal, commentiModal, likeModal);
    }, () => { });
});

$(document).on('click', '.fotoCommentoAz', async function () {
    //visto che il percorso è univoco prendo quello come valore di riferimento
    let src = $(this).parent().parent().prev().attr('src');
    src = src.replace('./postImages/', '');

    //mando al server tutti i dati necessari per creare la finestra in sovra impressione coi dettagli del post
    await sendPostData(urlGetPost, { getPostData: src }, (data) => { dataModal = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getCommenti: src }, (data) => { commentiModal = JSON.parse(data); }, () => { });
    await sendPostData(urlGetPost, { getLike: src }, (data) => { likeModal = JSON.parse(data); }, () => { });

    drawModalPost(dataModal, commentiModal, likeModal);

    $('.modalPost').addClass('active');
    $('.overlay').addClass('active');
    $('body').css('overflow', 'hidden');
});

$(document).on('click', '.fotoLikeAz', async function () {

    let src = $(this).parent().parent().prev().attr('src').replace("./postImages/", "");
    let srcImgLike = $(this).attr('src');
    let azioniPost = $(this).parent().parent();
    if (srcImgLike == "./assets/already_like_icon.png") {
        await sendPostData(currentUrl, { deleteLike: src }, async () => {
            await sendPostData(urlGetPost, { getLike: src }, (data) => { dataAzioniPost = JSON.parse(data); }, () => { });
            await sendPostData(urlGetPost, { getNumCommenti: src }, (data) => { commentiPostFeed = JSON.parse(data); }, () => { });
            drawAzioniBox(azioniPost, dataAzioniPost, commentiPostFeed);
        }, () => { });
    }
    else await sendPostData(currentUrl, { like: src }, async () => {
        await sendPostData(urlGetPost, { getLike: src }, (data) => { dataAzioniPost = JSON.parse(data); }, () => { });
        await sendPostData(urlGetPost, { getNumCommenti: src }, (data) => { commentiPostFeed = JSON.parse(data); }, () => { });
        drawAzioniBox(azioniPost, dataAzioniPost, commentiPostFeed);
    }, () => { });
});

$('.searchInput').keyup(searchPerson);