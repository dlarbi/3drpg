define(function () {
  var APP;
  return {
    init: function(APP){
      APP = APP;
    },

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


      var keys = {};

      $(document).keydown(function (e) {
        keys[e.keyCode] = true;
        checkKey(e)
      });

      $(document).keyup(function (e) {
      if (e.keyCode == '38') {
        // up arrow
        window.userInputZ = 0;
      }
      else if (e.keyCode == '40') {
        window.userInputZ = 0;
      }
      else if (e.keyCode == '37') {
        // left arrow
        window.userTurnL = 0;
      }
      else if (e.keyCode == '39') {
        // right arrow
        window.userTurnR = 0;
      }
      else if (e.keyCode == '32') {
        // right arrow
        window.userInputY = 0;
      }
        delete keys[e.keyCode];
      });

      function checkKey(e) {

        e = e;

        if (typeof keys[38] != "undefined") {
          // up arrow
          window.userInputZ = .05;
        }
        else if (typeof keys[40] != "undefined") {
          window.userInputZ = -.05;
        }
        else if (typeof keys[37] != "undefined") {
          // left arrow
          window.userTurnL = 1;
        }
        else if (typeof keys[39] != "undefined") {
          // right arrow
          window.userTurnR = 1;
        }
        else if (typeof keys[32] != "undefined") {
          // right arrow
          window.userInputY = .6;
        }

      }
    }
  };


});
