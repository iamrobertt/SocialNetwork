let fotoPost, nomeFotoPost;

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

async function sendPostData(url, data, success, error){
  await $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      error: error,
  });
}

$('.submit_new_post').on('click', async function(){

    let url = "https://necular.altervista.org/SocialNetwork/createPost.php";
    let descrizioneCreaPost = $('.descrizioneCreaPost').val();

    let fd = new FormData();
    fd.append('fotoCreaPost', fotoPost, nomeFotoPost);
    await sendPhotoData(url, fd, () => {} , () => { alert("Errore nella richiesta per l'invio della foto"); });
    
    await sendPostData(url, {descrizioneCreaPost: descrizioneCreaPost}, () => {window.location.href = "https://necular.altervista.org/SocialNetwork/profile.php"} , () => { alert("Errore nella richiesta"); });
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
        $getFotoProfilo.one('load', e => URL.revokeObjectURL(e.target.src)).css({"width": '100%', "height": 'auto', "border-radius": '4px', "object-fit": 'cover'}).prop('src', URL.createObjectURL(F[0]));
        fotoPost = F[0];
        nomeFotoPost = F[0].name;
        }
    }
});

$('.fotoPostImg').eq(0).on('click', function() {
    $getFotoProfilo = $(this);
    $fileInput.click();
});