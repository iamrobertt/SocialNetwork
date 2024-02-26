let urlGetUserPosts = "https://necular.altervista.org/SocialNetwork/getData/getUserPosts.php";
let urlGetPost = "https://necular.altervista.org/SocialNetwork/getData/getDataPost.php";
let urlGetNotifications = "https://necular.altervista.org/SocialNetwork/getData/getUserNotifications.php";
let currentUrl = window.location.href;
let username = currentUrl.split('=')[1];
let dataModal, commentiModal, likeModal;

let utenteCercato = currentUrl.includes('username');

async function sendPostData(url, data, success, error){
    await $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        error: error,
    });
}

function cancellaElementi(elemento){
    while(elemento.children().length > 0) elemento.children().remove();
}

//funzione che prende il json coi dati di ogni post(se presenti) e li inserisce nella pagina
function drawUsersPost(dataPosts){

    let postsProfileBox = $('.postsProfileInner');
    let pathFotoPosts = [];
    let dateTimePosts = [];
    //se non ci sono post mostro un messaggio
    if(dataPosts == undefined) {
        cancellaElementi(postsProfileBox);
        return;
    }

    //se l'utente è cercato e il suo account è privato, allora non stampare niente

    if((utenteCercato && typeFollow == 1) || (utenteCercato && typeFollow == "null" && typeAccount == 1)) {
        postsProfileBox.append(`<p class = "noPost">L'utente ha un account privato. Seguilo per vedere i suoi post!</p>`)
        return;
    }

    //elimino tutti i "figli" presenti dentro la div
    cancellaElementi(postsProfileBox);

    //loopo ogni elemento json e mi prendo i dati del post salvando tutto in 3 array
    $.each(dataPosts, function(i, data){
        dateTimePosts.push(data.dateTimePost);
        pathFotoPosts.push(data.pathFotoPost);
    });

    //se la descrizione del post supera 35 caratteri, la tronco e aggiungo "..."
    //for(let i = 0; i < descrizionePosts.length; i++) if(descrizionePosts[i].length > 35) descrizionePosts[i] = descrizionePosts[i].substring(0, 35) + "...";
    
    //se non trova nessun utente stampo il messaggio di errore, altrimenti
    //ciclo un array (tanto hanno tutti la stessa lunghezza) e stampo tutti gli utenti trovati
    if(dateTimePosts.length == 0) postsProfileBox.append('<p class = "noPost"><br><br>Ancora nessun post.</p>');
    else for(let i = 0; i < dateTimePosts.length; i++) postsProfileBox.append(`<div class="postBox"> <div class="descrizionePost"> <img class="fotoPost" src="./postImages/${pathFotoPosts[i]}" alt=""> </div> </div>`);
}

function drawModalPost(dataModalPost, dataModalCommenti, likeModal){

    //dati per query del post
    let modalPost = $('.modalPostBody');
    let username;
    let dataPost;
    let descrizionePost;
    let src;
    let foto_profilo;
    
    cancellaElementi(modalPost);

    $.each(dataModalPost, function(i, data){
        username = data.username_post;
        dataPost = data.data_post;
        descrizionePost = data.descrizione_post;
        src = data.src;
        foto_profilo = data.foto_profilo;
    });

    if(username == "" || dataPost == "" || src == "") return;


    //dati per queri per i commenti
    let commentiBox = $("<div class='commentiBox'></div>");
    let usernameCommento = [];
    let dataCommento = [];
    let descrizioneCommento = [];
    let fotoProfiloCommento = [];

    $.each(dataModalCommenti, function(i, data){
        usernameCommento.push(data.username_commento);
        dataCommento.push(data.data_commento);
        descrizioneCommento.push(data.descrizione_commento);
        fotoProfiloCommento.push(data.foto_profilo);
    });

    let likeposts = [];
    let checkLikePost = [];
    //dati per query per i like
    $.each(likeModal, function(i, data){
        likeposts.push(data.like_post);
        checkLikePost.push(data.check_like_post);
    });

    let likeImgSrc;

    if(checkLikePost == "1") likeImgSrc = "./assets/already_like_icon.png";
    else likeImgSrc = "./assets/like_icon.png";

    for(let i = 0; i < usernameCommento.length; i++) commentiBox.append(`<div class="commento">
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

//se viene fatta una get manda l'username dell'utente che si vuole visualizzare
//altrimenti significa che l'utente vuole visualizzare il proprio profilo
if(utenteCercato) sendPostData(urlGetUserPosts, {postsUtente: username}, (data) => {data = JSON.parse(data); drawUsersPost(data)}, () => {});
else sendPostData(urlGetUserPosts, {postsUtente: "localUser"}, (data) => { data = JSON.parse(data); drawUsersPost(data)}, () => {});

//nel caso l'utente non segua l'utene cercato mostro il bottone per poterlo seguire (controllo fatto in php)
//se viene clickato invia lo username dell'utente seguito al server che si occuperà di fare un query al database e salvare il follow
$('.FollowBtn').on('click',async function(){
    let utenteSeguito;
    if(utenteCercato) utenteSeguito = username;
    await sendPostData(currentUrl, {utenteSeguito: utenteSeguito}, () => {window.location.href = currentUrl;}, () => {});
});

//nel caso l'utente segue gia quella persona mostro il bottone per poter unfolloware (controllo anch'esso fatto in php)
//se viene clickato invia lo username dell'utente da eliminare al server che si occuperà di faeruna query al database ed eliminare il follow
$('.unFollowBtn').on('click',async function(){
    let utenteDelete;
    if(utenteCercato) utenteDelete = username;
    await sendPostData(currentUrl, {utenteDelete: utenteDelete}, () => {window.location.href = currentUrl;}, () => {});
});

$('.modificaProfilo').on('click', function(){
    window.location.href = "https://necular.altervista.org/SocialNetwork/settingsnprivacy.php";
});

//finestra a comparsa coi dettagli del post
$(document).on('click', '.fotoPost', async function() {
    //visto che il percorso è univoco prendo quello come valore di riferimento
    let src = $(this).attr('src');
    src = src.replace('./postImages/', '');

    //mando al server tutti i dati necessari per creare la finestra in sovra impressione coi dettagli del post
    await sendPostData(urlGetPost, {getPostData: src}, (data) => {dataModal = JSON.parse(data); }, () => {});
    await sendPostData(urlGetPost, {getCommenti: src}, (data) => {commentiModal = JSON.parse(data); }, () => {});
    await sendPostData(urlGetPost, {getLike: src}, (data) => {likeModal = JSON.parse(data); }, () => {});

    drawModalPost(dataModal, commentiModal, likeModal);

    $('.modalPost').addClass('active');
    $('.overlay').addClass('active');
    $('body').css('overflow', 'hidden');
});

$(document).on('click', '.chiudiModal', function(){
    $('.modalPost').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').css('overflow', 'auto');
});

$(document).on('click', '.overlay.active', function(){
    $('.modalPost').removeClass('active');
    $('.overlay').removeClass('active');
    $('body').css('overflow', 'auto');
});


$(document).on('click', '.btnAggiungiCommento', async function(){
    let commento = $(this).prev().val();
    let src = $(this).parent().parent().prev().attr('src').replace("./postImages/", "");

    let data = {
        commento: commento,
        src: src
    }
    await sendPostData(currentUrl, data, async  () => {
        await sendPostData(urlGetPost, {getPostData: src}, (data) => {dataModal = JSON.parse(data); }, () => {});
        await sendPostData(urlGetPost, {getCommenti: src}, (data) => {commentiModal = JSON.parse(data); }, () => {});
        drawModalPost(dataModal, commentiModal, likeModal);
    }, () => {});
});

$(document).on('click', '.fotoLike', async function(){

    let src = $(this).parent().prev().attr('src').replace("./postImages/", "");
    let srcImgLike = $(this).attr('src');
    
    if(srcImgLike == "./assets/already_like_icon.png"){
        await sendPostData(currentUrl, {deleteLike: src}, async () => {
            await sendPostData(urlGetPost, {getPostData: src}, (data) => {dataModal = JSON.parse(data); }, () => {});
            await sendPostData(urlGetPost, {getLike: src}, (data) => {likeModal = JSON.parse(data); }, () => {});
            drawModalPost(dataModal, commentiModal, likeModal);
        }, () => {});
    }
    else await sendPostData(currentUrl, {like: src}, async () => {
        await sendPostData(urlGetPost, {getPostData: src}, (data) => {dataModal = JSON.parse(data); }, () => {});
        await sendPostData(urlGetPost, {getLike: src}, (data) => {likeModal = JSON.parse(data); }, () => {});
        drawModalPost(dataModal, commentiModal, likeModal);
    }, () => {});
});

$(document).ready(async function(){
    await sendPostData(urlGetNotifications, {getNotifications: true}, (data) => {notifications = JSON.parse(data); drawNotifications(notifications); }, () => {});
});