define(function () {

  return {
    mouseInputOn: function() {
      window.userInputX = 0;
      window.userInputY = 0;
      window.userInputLClick = 0;


      function updateMousePosition(evt) {
        window.userInputX = evt.clientX;
        window.userInputY = evt.clientY;
      }
      window.addEventListener('click', function(e) {
        window.userInputLClick = 1;
        window.clickX = e.offsetX;
        window.clickY = e.offsetY;
      }, false);
      window.addEventListener('mousemove', function mouseMove (evt) {
      //  updateMousePosition(evt);
      }, false);
    },

    FindElementDocumentPosition: function(element) {
      return element.position();
    },

    keyboardInputOn: function() {
      window.userInputX = 0;
      window.userInputY = 0;
      window.userInputZ = 0;
      window.userTurnL = 0;
      window.userTurnR = 0;
      document.onkeydown = checkKey;

      function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
          // up arrow
          window.userInputZ = .05;
        }
        else if (e.keyCode == '40') {
          window.userInputZ = -.05;
        }
        else if (e.keyCode == '37') {
          // left arrow
          window.userTurnL = 1;
        }
        else if (e.keyCode == '39') {
          // right arrow
          window.userTurnR = 1;
        }
        else if (e.keyCode == '32') {
          // right arrow
          window.userInputY = .6;
        }

      }
    }
  };


});
