/*======================================================INITIALISATION=========================================================*/


//On crée l'HTML de chaque carte et on renvoie le tableau d'objet HTML correspondant.
function initAffichCards(){
  var container = document.getElementById('screenGame');
  var row;
  var cards;

  //On veut un HTML qui fasse 4 lignes de 4 cartes:
  for(var i = 0; i < 4; i++){ //Chaque passage de boucle crée une row.
    container.innerHTML += "<div class='row'></div> \n";
    row = document.getElementsByClassName('row');
    row[i].style.height = 600/4+'px';


    for (var j = 0; j < 4; j++) { //On vient de faire une row, on lui assigne immédiatement les 4 cartes.
      row[i].innerHTML += "<div class='card'></div> \n";
    };
  };

  //Le HTML est terminé mais on a besoin du style pour l'affichage.
  cards = document.getElementsByClassName('card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.background = "url('assets/sprites/back.png')";
    cards[i].style.backgroundSize = "cover";
    cards[i].style.height = '110px';
    cards[i].style.width = '80px';
  }
  //D'une pierre deux coups, on renvoie le tableau de cartes nécessaire à la création du style.
  return cards
}




//La fonction crée un tableau de valeur correspondant à la valeur des cartes.
function positCards(){
  var array = [];
  var hasard = [0, 0];//On tirera les position de chaque valeur au hasard, les cartes sont des paires, il y a donc deux positions pour une valeur.

  //Il y a 16 cartes donc 8 valeurs en tout. On bouclera donc 1 fois par valeur:
  for(var i=0; i<8; i++){

    do{
      hasard[0] = Math.floor((Math.random() * 15) + 0); //On tire un nombre au hasard entre 0 et 15 (soit 16 possibilités pour les 16 positions)
      hasard[1] = Math.floor((Math.random() * 15) + 0); //On tire un deuxième nombre, deux positions pour une valeur.
    }while(hasard[0] == hasard[1]) //Si les deux nombres sont identiques, on recommence pour éviter le conflit. PAS NECESSAIRE

    for(var j = 0; j < 2; j ++){ //On a deux positions, on va donc faire deux fois: ...
      while(array[hasard[j]] != undefined){ //On vérifie qu'il n'y a pas déjà une valeur dans la position tiré au hasard.

        console.log('hasard[j], case occupé: '+hasard[j]+' incrémentation: '+(hasard[j]+1));
        hasard[j] += 1; //Si c'est le cas, on regarde la position suivante et on revérifie.

        if(hasard[j] > 15){ //On préalable, on s'assure que la position suivante n'est pas supérieure à la taille attendue du tableau.
          console.log('hasard[j], incrémentation supérieure ou égale à 16: '+hasard[j]+' retour à 0 ');
          hasard[j] = 0; //Si c'est le cas, alors la position suivante est en fait 0.
        }
      }
      console.log('Espace trouvé : '+ hasard[j] +' pour valeur: '+i);
      array[hasard[j]] = i; //Une fois qu'on est sûr qu'il n'y a pas de valeur dans la position souhaitée, on assigne la valeur.
    }
  }
  console.log('array: ');
  for(var k = 0; k < array.length; k++){
    console.log('case: '+k+ ' valeur: '+array[k]);
  }
  return array; //On retourne le tableau de valeur.
}




//La fonction reçoit le tableau de DOM et celui de valeur, elle renvoie un tableau compilé de ces informations.
function constructObjects(arrayObject, arrayValue){
  var arrayFinal = [];//Le tableau d'objet qu'on renverra

  for(var i=0; i<arrayObject.length; i++){//Pour chaque élément du tableau DOM on construit un objet:
    arrayFinal[i] = {
      dom : arrayObject[i], //DOM de la carte
      value : arrayValue[i], //Valeur de la carte
      activ : false, //La carte est elle face visible actuellement ?
      outGame : false //La carte fait elle encore partie du jeu ou bien a t'elle été trouvée ?
    }
  }
  return arrayFinal
}






/*======================================================AFFICHAGE CARTE========================================================*/




//change le chemin de l'image, active la carte.
function returnCardForActiv(cards){
  cards.dom.style.background = "url('assets/sprites/"+cards.value.toString()+".png')";
  cards.dom.style.backgroundSize = "cover";
  cards.activ = true;
}


//change le chemin de l'image, désactive la carte.
function returnCardForDisactiv(cards){
  cards.dom.style.background = "url('assets/sprites/back.png')";
  cards.dom.style.backgroundSize = "cover";
  cards.activ = false;
}



/*======================================================CONTROLE DU JEU========================================================*/


//Quand on trouve, on change les paramêtres des objets trouvés.
function onFound(cardOne, cardTwo){
  cardOne.outGame = true;
  cardTwo.outGame = true;
  cardOne.activ = false;
  cardTwo.activ = false;
}


//Fonction qui parcourt le tableau à la recherche de cartes encore en jeu.
function isWin(cards){
  var finish = true;
  for(var i=0; i<cards.length; i++){
    console.log(i);
    if(!cards[i].outGame){
      console.log('Carte encore en jeu : '+i);
      finish = false;
    }
  }
console.log(finish);
return finish
}


function aiguilleur(cards, id){
  returnCardForActiv(cards[id]); //On retourne la carte cliquée (côté face).
  var activ;


//On recherche les cartes actives, s'il n'y en a pas ou si la carte active est la carte cliquée, on déclare la carte active.
  for(var i=0; i<cards.length; i++){
    if(cards[i].activ && cards[i] != cards[id]){
      activ = i;
      console.log('Carte active: '+i);
    }
  }


//S'il y a une carte active, on compare leur valeur, si c'est juste on renvoie à onFound,
//(!!! BUG !!!) sinon on attends deux secondes et on désactive les cartes.
//Soluce: Et si on retournait les deux cartes soit au bout de deux secondes, soit au prochain clic ?
  if(activ != undefined){
    if(cards[activ].value == cards[id].value){
      console.log('Trouvé !');
      onFound(cards[activ], cards[id]);
    }else{
      console.log('Faux !');
      setTimeout(function(){
        console.log('Carte active : '+activ+' + '+id);
        returnCardForDisactiv(cards[activ]);
        returnCardForDisactiv(cards[id]);
      }, 2000);
    }
  }
}



/*======================================================Vérificateur========================================================*/


//BUG ligne 160, pour régler momentanément le problème, on empêche plus de deux cartes d'être retournées en même temps.
//Si plus de deux cartes retournées, on les désactive.
function blockThird(cards){
  var numberActiv = [];
  var id = 0;

  for(var i=0; i<cards.length; i++){ //on boucle le long du tableau de cartes
    if(cards[i].activ){//on cherche les cartes activent
      numberActiv[id] = i;//on enregistre leur position dans le tableau.
      id ++;
    }
  }

  if(id >= 2) {//Si plus de deux cartes activent.
    for(var i = 0; i < numberActiv.length; i++) {//on renvoie toutes les cartes enregistrées à disactiv.
      returnCardForDisactiv(cards[numberActiv[i]]);
    }
  }
}



/*======================================================MAIN========================================================*/


var cards = constructObjects(initAffichCards(), positCards());//Grace aux deux tableaux renvoyés par les fct d'initialisation, on crée un seul tableau d'objet.

for(var i=0; i<cards.length; i++){
  cards[i].dom.addEventListener('click', function(){
    for(var j=0; this!=cards[j].dom; j++){}//On vérifie quelle carte a été cliqué.
    
    blockThird(cards)//Reglage du BUG ligne 159 ... (Note: Solution à modifier).

    aiguilleur(cards, j);//On envoie le tableau de cartes et le numéro de la carte cliquée.

    if(isWin(cards)){
      alert('Vous avez Gagné !');
    };
  });
}
