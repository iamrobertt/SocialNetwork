/**Inizialmente nascondo tutti i box di registrazione per far vedere solo quello di login */
$('.register1Box').hide();
$('.register2Box').hide();
$('.register3Box').hide();
// $('.loginBox').hide();
/**Nel caso venga cliccato il testo del sign up nascondi la parte del login e successivamente fai vedere quella della prima parte della registrazione */
$('.goToRegister1').on("click", function () {
    $(".loginBox").hide(1000, function () {
        $(".register1Box").show(1000, function() {
            $('h2').eq(0).html(replaceWithWhiteSpace($('h2').eq(0).html()));
        });
    });
});

/**Funzione, che tramite il nome dell'id o dela classe dell'oggetto, riesce ad aggiungere la classe focus definita nel css che fa lampeggiare l'icona e l'input fin quando è premuta  */
/**Funzione resa dinamica perche sarebbe stata troppo lunga da scrivere per ogni classe */
function onFocusOnBlur(idOrClassName){
    $(document).on('focus',idOrClassName, function() {
        $(idOrClassName).addClass('focus');
        $(`.inputBox img${idOrClassName}`).children('img').addClass('focus');
    });
    
    $(document).on('blur', idOrClassName, function() {
        $(idOrClassName).removeClass('focus');
        $(`.inputBox img${idOrClassName}`).children('img').removeClass('focus');
    });
}


$('.passwordLogin').on('focus', function(){
    $('.pandaImg').attr('src', './assets/panda__coperto_trasparente.png')
});

$('.passwordLogin').on('blur', function(){
    $('.pandaImg').attr('src', './assets/panda_trasparente.png')
});
onFocusOnBlur('.emailLogin');
onFocusOnBlur('.passwordLogin');
onFocusOnBlur('.nomeRegistrazione');
onFocusOnBlur('.cognomeRegistrazione');
onFocusOnBlur('.emailRegistrazione');
onFocusOnBlur('.passwordRegistrazione');
onFocusOnBlur('.passwordRegistrazioneConferma');
onFocusOnBlur('.telefonoRegistrazione');

