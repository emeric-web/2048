(function($) {
  $.fn.ma_methode = function()
  {
    $(this).wrap('<b><i><u></u></i></b>');
  };
  $.fn.twothousandsfortyeight = function()
  {
    checkCookie();
///////////////////////////////////////////////////////////INITIALISATION///////////////////////////////////////////////////////////

// initialisation du son
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'audio/unmaximize.oga');
    var emptyDivs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var square_size = 175;
    var scoreNbr = 0;
    var scoreNbrMax = getCookie('scoreUser');
    var direction = {gauche: [-1, 0], droite: [1, 0], haut: [0, -1], bas: [0, 1]};
// insertion des divs
    // bouton du Modal
    $('body').append('<button id="myBtn">Open Modal</button>');
    //le modal
    $('body').append('<div id="myModal" class="modal"><div class="modal-content"><p>Vous avez gagné !</p><p>résultat : <span>0</span></p></div></div>');
    $("body").append("<div id='game_2048'></div>");
    //construction des éléments dans la zone générale
    $('#game_2048').append('<div class="head"></div>');
    $('.head').append('<div class="score"><span>0</span></div>');
    $('.head').append('<div class="scoreMax"><p>meilleur résultat</p><span>'+scoreNbrMax+'</span></div>');
    $('.head').append('<div class="newGame"><span>nouvelle partie</span></div>');
    $('#game_2048').append('<div id="playingArea"></div>');
// Selection du modal
    var modal = $('#myModal');
    var spanNewGame = $('.newGame');
//css
    //pour le modal
    $('.modal').css({
      'display': 'none', /* Hidden by default */
      'position': 'fixed', /* Stay in place */
      'z-index': '1', /* Sit on top */
      'left': '0',
      'top': '0',
      'width': '100%', /* Full width */
      'height': '100%', /* Full height */
      'overflow': 'auto', /* Enable scroll if needed */
      'background-color': 'rgb(0,0,0)', /* Fallback color */
      'background-color': 'rgba(0,0,0,0.4)' /* Black w/ opacity */
    }),
    $('.modal-content').css({
      'text-align': 'center',
      'font-size': '40px',
      'background-color': '#fefefe',
      'margin': '15% auto', /* 15% from the top and centered */
      'padding': '20px',
      'border': '1px solid #888',
      'width': '40%'
    });
    //zone générale
    $('#game_2048').css({
      'height': '830px',
      'margin': '20px auto',
      'position': 'relative',
      'width': '700px'
    });
    //en tête
    $('.head').css({
      'height': '130px',
      'position': 'relative',
      'text-align': 'center',
    });
    $('.head div').css({
      'display': 'inline-block',
      'height': '100px',
      'float': 'left',
      'color': 'white',
      'font-size': '30px',
      'margin': '15px',
      'width': '29%',
    });
    $('.head div:nth-child(1)').css({
      'font-size': '85px',
      'background-color': '#ccb4cc'
    });
    $('.head div:nth-child(2)').css({
      'font-size': '60px',
      'background-color': '#b4bfcc'
    });
    $('.head div:nth-child(2) p').css({
      'font-size': '15px',
      'color': 'white',
      'margin': '0px'
    });
    $('.head div:nth-child(3)').css({
      'font-size': '38px',
      'background-color': '#b4ccb4'
    });
    //zone de jeu
    $('#playingArea').css({
      'height': '700px',
      'position': 'relative',
      'width': '700px',
      'background-color': '#cdc1b4',
      'border-radius': '87.5px'
    });
//construction des divs dans la zone de jeu
    for (let i = 0; i < 16; i++) {
      $('#playingArea').append("<div class=0 style='left: " + ((i % 4) * square_size) + "px; top: " + Math.floor(i / 4) * square_size + "px; width: " + square_size + "px; height: " + square_size + "px; background-position: " + (-(i % 4) * square_size) + "px " + -Math.floor(i / 4) * square_size + "px '></div>");
    }
    //css des divs
    $('#playingArea div').css({
      'cursor': 'pointer',
      'height': '175px',
      'line-height': '175px',
      'position': 'absolute',
      'text-align': 'center',
      'width': '175px'
    });
//variables
    var modal = $('#myModal');// pour le modal
    var btn = $('#myBtn');// pour le modal
    var balls = $('#playingArea div');
//génération de 2 billes sur la zone de jeu
    initBall();
    initBall();

///////////////////////////////////////////////////////////ÉVÉNEMENTS///////////////////////////////////////////////////////////
//ACTIONS AU CLIQUE

    //LANCEMENT D'UNE NOUVELLE PARTIE EN CLIQUANT SUR LE BOUTON
    spanNewGame.click(function(){
      newGame();
    });
    // en cliquant sur le bouton Modal, on ouvre le modal
    btn.click(function() {
      if (scoreNbr > scoreNbrMax)
        scoreNbrMax = scoreNbr;
      $('.scoreMax span').text(scoreNbrMax);
      modal.css('display', 'block');
      setCookie('scoreUser', scoreNbrMax, 30);
    });
    // fermer le modal au clique
    modal.click(function() {
      modal.css('display', 'none');
      newGame();
    });

//ACTIONS AU CLAVIER

// pour surveiller les touches directionnelles et appeller une action
    $(document).on( "keydown",  keyPressed);
    function keyPressed (e){
      e = e || window.e;
      var newchar = e.which || e.keyCode;
      switch (newchar) {
        case 38:
          console.log('déplacement vers le haut :', translationBallsUp());
          break;
        case 40:
          console.log('déplacement vers le bas :', translationBallsDown());
          break;
        case 39:
          console.log('déplacement vers la droite :', translationBallsRight());
          break;
        case 37:
          console.log('déplacement vers la gauche :', translationBallsLeft());
          break;
      }
      balls.removeClass('blocked'); //toutes les billes pourront de nouveau intéragir
      console.log(emptyDivs);
    }

///////////////////////////////////////////////////////////FONCTIONS///////////////////////////////////////////////////////////

// initialisation d'une bille sur le terrain
    function initBall() {

      let x = Math.floor(Math.random() * emptyDivs.length);
      x = emptyDivs[x];
      console.log(x);
      let div = $(balls[x]);
      let i = 2 * Math.floor((Math.random() * 2) + 1);
      div.attr('class' , i).css('background', 'url("img/bille_' + i + '.png")').css('opacity', '0').animate({opacity: '1'}, "slow");
      let index = emptyDivs.indexOf(x);
      if (index !== -1) emptyDivs.splice(index, 1);
      console.log(emptyDivs);
      if (emptyDivs.length == 0){
        var gameNotOver = false;
        balls.each(function(){
          gameNotOver += compareBall(this, 'gauche');
          console.log(gameNotOver);
          gameNotOver += compareBall(this, 'droite');
          console.log(gameNotOver);
          gameNotOver += compareBall(this, 'haut');
          console.log(gameNotOver);
          gameNotOver += compareBall(this, 'bas');
          console.log(gameNotOver);
          if (gameNotOver == true) return false;
        })
        if (gameNotOver == false) {
          $('.modal-content').html('<p>Vous avez perdu !</p>');
          modal.css('display', 'block');
        }
      }
    }
// translation des billes vers le haut
    function translationBallsUp(){
      let action = false;
      for (let i = 0; i < 16; i++) {
        let diff = 0;
        if ($(balls[i]).attr('class') > 0 && $(balls[i]).css('top') != '0px'){
          while ($(balls[i+diff-4]).attr('class') == 0) {
            moveBall(balls[i+diff], balls[i+diff-4]);
            zeroBall(balls[i+diff]);
            diff -= 4;
            action = true;
          }
          if ($(balls[i+diff-4]).attr('class') == $(balls[i+diff]).attr('class')) {
            concatBall(balls[i+diff-4]);
            zeroBall(balls[i+diff]);
            action = true;
          }
        }
      }
      if (action == true){
        audioElement.currentTime = 0;
        audioElement.play();
        initBall();
      }
      return action;
    }
// translation des billes vers le bas
    function translationBallsDown(){
      let action = false;
      for (let i = 15; i >= 0; i--) {
        let diff = 0;
        if ($(balls[i]).attr('class') > 0 && $(balls[i]).css('top') != '525px'){
          while ($(balls[i+diff+4]).attr('class') == 0) {
            moveBall(balls[i+diff], balls[i+diff+4]);
            zeroBall(balls[i+diff]);
            diff += 4;
            action = true;
          }
          if ($(balls[i+diff+4]).attr('class') == $(balls[i+diff]).attr('class')) {
            concatBall(balls[i+diff+4]);
            zeroBall(balls[i+diff]);
            action = true;
          }
        }
      }
      if (action == true){
        audioElement.currentTime = 0;
        audioElement.play();
        initBall();
      }
      return action;
    }
// translation des billes vers la gauche
    function translationBallsLeft(){
      let action = false;
      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          let i = (4 * y) + x;
          let diff = 0;
          if ($(balls[i]).attr('class') > 0 && $(balls[i]).css('left') != '0px'){
            while ($(balls[i+diff-1]).attr('class') == 0 && diff > -x) {
              moveBall(balls[i+diff], balls[i+diff-1]);
              zeroBall(balls[i+diff]);
              diff -= 1;
              action = true;
            }
            if ($(balls[i+diff-1]).attr('class') == $(balls[i+diff]).attr('class')) {
              concatBall(balls[i+diff-1]);
              zeroBall(balls[i+diff]);
              action = true;
            }
          }
        }
      }
      if (action == true){
        audioElement.currentTime = 0;
        audioElement.play();
        initBall();
      }
      return action;
    }
// translation des billes vers la droite
    function translationBallsRight(){
      let action = false;
      for (let x = 3; x >= 0; x--) {
        for (let y = 3; y >= 0; y--) {
          let i = (4 * y) + x;
          let diff = 0;
          if ($(balls[i]).attr('class') > 0 && $(balls[i]).css('left') != '525px'){
            while ($(balls[i+diff+1]).attr('class') == 0 && diff < (3-x)) {
              moveBall(balls[i+diff], balls[i+diff+1]);
              zeroBall(balls[i+diff]);
              diff += 1;
              action = true;
            }
            if ($(balls[i+diff+1]).attr('class') == $(balls[i+diff]).attr('class')) {
              concatBall(balls[i+diff+1]);
              zeroBall(balls[i+diff]);
              action = true;
            }
          }
        }
      }
      if (action == true){
        audioElement.currentTime = 0;
        audioElement.play();
        initBall();
      }
      return action;
    }

//coordonnées de la div
    function whereIsTarget(objet) {
      let position = [$(objet).css('left').replace('px', '')/175, $(objet).css('top').replace('px', '')/175];
      return position;
    }
//numéro de la div
    function whoIsTarget(position) {
      return position[0] + 4*position[1];
    }

//test si 2 billes ont la même valeur
    function compareBall(objet, dir){ //la fonction prend en argument le numéro de la div, et la direction relative de la div avec laquelle comparer (gauche, droite, ...)
      let position = whereIsTarget(objet);
      let i = whoIsTarget(position);
      console.log('bille en position : '+position);
      position[0] += direction[dir][0];
      position[1] += direction[dir][1];
      let j = whoIsTarget(position);
      if (position[0] < 0 || position[0] > 3 || position[1] < 0 || position[1] > 3) {
        console.log(dir + ' : pas de div');
        return false;
      }
      else if ($(balls[i]).attr('class') == $(balls[j]).attr('class')) {
        console.log(dir + ' : les 2 billes sont ÉGALES');
        return true;
      }
      else {
        console.log(dir + ' : différentes');
        return false;
      }
    }
// augmenter les valeurs d'un div
    function concatBall(ball, i = 2048) {
      if ($(ball).attr('class') == 0) {
        $(ball).css('background', 'url("img/bille_' + 2 + '.png")');
        $(ball).attr('class', '2');
      }
      else if ($(ball).attr('class') == i){
        i += i;
        scoreNbr += i;
        $('.score span, #myModal span').text(scoreNbr);
        $(ball).attr('class', i).css('background', 'url("img/bille_' + i + '.png")').animate({opacity: '0.5'}, "fast").animate({opacity: '1'}, "fast").addClass('blocked', function(){
          if (i == 2048){
            if (scoreNbr > scoreNbrMax)
              scoreNbrMax = scoreNbr;
            $('.scoreMax span').text(scoreNbrMax);
            modal.css('display', 'block');
            setCookie('scoreUser', scoreNbrMax, 30);
            //navigator.userAgent
            return;
          }
        });
      }
      else {
        concatBall(ball, i/2)
      }
    }
// copier les attributs d'un div à un autre
    function moveBall(oldBall, newBall) {
      let i = $(oldBall).attr('class');
      $(newBall).attr('class', i).css('background', 'url("img/bille_' + i + '.png")');
      i = whoIsTarget(whereIsTarget(newBall));
      let index = emptyDivs.indexOf(i);
      if (index !== -1) emptyDivs.splice(index, 1);
    }
// mettre les attributs d'un div à 0
    function zeroBall(ball) {
      $(ball).attr('class', '0').css('background', '');
      let i = whoIsTarget(whereIsTarget(ball));
      emptyDivs.push(i);
      console.log('div '+i+' ajouté à la liste emptyDivs');
    }
//lancer une nouvelle partie
    function newGame(){
      balls.attr('class', '0').css('background', '');
      scoreNbr = 0;
      $('.score span, #myModal span').text(scoreNbr);
      initBall();
      initBall();
    }
//cookie pour le meilleur résultat
    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
    function checkCookie() {
      var user=getCookie("username");
      if (user != "") {
        if (user.toLowerCase() == 'quentin') alert("raaaaa qu'est ce tu fais encore là toi !");
        else alert("Salut " + user +" qu'est-ce-que tu deviens ?");
      } else {
         user = prompt("Entrez votre nom :","");
         if (user != "" && user != null) {
           setCookie("username", user, 30);
           setCookie("scoreUser", 0, 30);
         }
      }
    }
  };
})(jQuery);
