/**Dichiaro tutti i mesi dell'anno */

/**
 * 
 * FORSE E' MEGLIO METTERE I GIORNI E L'ANNO COME INPUT E NON COME SELECT
 * 
 */


const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

let meseRegistrazione = document.querySelector('.meseRegistrazione');
let annoRegistrazione = document.querySelector('.annoRegistrazione');
let giornoRegistrazione = document.querySelector('.giornoRegistrazione');

/**Inizialente nascondo la scelta del giorno e il mese per poi farle apparire man mano che i dati vengono inseriti*/
if(nascondiCampi){
    $('.meseRegistrazione').hide();
    $('.giornoRegistrazione').hide();
    scriviAnni();
    scriviMesi();
}
else{
    scriviAnni();
    scriviMesi();
    scriviGiorni(meseRegistrazione.value);
}

/**Nel caso l'anno o il mese cambino allora prendi il valore dei dati cambiati e riscrivi i giorni adeguandoli */
$('.annoRegistrazione').on('change', function(){
    $('.meseRegistrazione').show(500);
    scriviGiorni(meseRegistrazione.value);
});

$('.meseRegistrazione').on('change', function(){
    $('.giornoRegistrazione').show(500);
    let mese = $('.meseRegistrazione').val();
    scriviGiorni(mese);
});


function scriviMesi(){

    /**Creo un elemento option e lo "scrivo" ogni volta sotto all'elemento precedente, gli assegno il valore numerico del mese e il nome */
    for(let i = 1; i <= mesi.length; i++){
        let option = document.createElement('option');
        option.textContent = mesi[i-1];
        option.value = i;
        meseRegistrazione.appendChild(option);
    }

}

function scriviAnni(){
    
    /**Prende la data di oggi e poi successivamente solo l'anno per poi fare un ciclo dal 1900 ad oggi e stampare tutte le date */
    let data = new Date();
    let anno = data.getFullYear();

    for(let i = anno; i >= 1900; i--){
        let option = document.createElement('option');
        option.textContent = i;
        option.value = i;
        annoRegistrazione.appendChild(option);
    }

}

function scriviGiorni(mese){
    
    /**Finche ci sono piu di due elementi dentro la select del giorno eliminali tutti, dacendo rimanere solo la parola "Giorno* " */
    while(giornoRegistrazione.childNodes.length > 2) giornoRegistrazione.removeChild(giornoRegistrazione.lastChild);

    let data = new Date();
    let giorni = 0;
    let anno = annoRegistrazione.value;

    /**Controllo le varie casistiche dei mesi per assegnare i giorni correttamente */
    if(mese == 1 || mese == 3 || mese == 5 || mese == 7 || mese == 8 || mese == 10 || mese == 12) giorni = 31;
    else if(mese == 4 || mese == 6 || mese == 9 || mese == 11) giorni = 30;
    else if(mese == 2 && anno % 4 == 0) giorni = 29
    else giorni = 28;

    /**Stesse cose degli altri 2 */
    for(let i = 1; i <= giorni; i++){
        let option = document.createElement('option');
        option.textContent = i;
        option.value = i;
        giornoRegistrazione.appendChild(option);
    }
    
}