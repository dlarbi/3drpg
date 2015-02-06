define(function () {


  return {
    cssCube : function() {
      this.modelData = '<div id="cube" class="" data-entity=""><div></div><div></div><div></div><div></div><div></div><div></div><div id="health"></div></div>';
      return this;
    },

    cssBigBuilding : function() {
      this.modelData = '<div id="tallBuilding" class="" data-entity=""><div></div><div></div><div></div><div></div><div></div><div></div><div id="health"></div></div>';
      return this;
    },

    cssTallBuilding: function() {
      this.modelData = '<div class="wrapper"><div class="side1"></div><div class="side2"></div><div class="side3"></div><div class="side4"></div><div class="side5"></div></div>';
      return this;
    },

    cssCoin : function() {
      this.modelData = '<div id="coin" class="animate" data-entity=""></div>';
      return this;
    },

    cssSorcerer : function() {
      this.modelData = '<div class="sorcerer" data-entity=""></div>';
      return this;
    },

    cssBullet : function() {
      this.modelData = '<div class="bullet"></div>';
      return this;
    },

    singlePixel : function(x,y,z) {
      var pixels = [
        {
          x:x,
          y:y,
          z:z,
          color:[0, 1, 0, 255]
        }
      ];
      return pixels;
    },

    //Super deprecated.  This is just a fun relic
    getPlayerModel : function() {
      var pixels = [];
      for (var x = -150; x < 150; x+=5) {
        for (var y = -150; y < 150; y+=5) {
          pixels.push({
            x: x,
            y: y,
            z: 1,
            color: [0,1,0,255]
          })
        }
      }
      return pixels;
    },

    flatFloor : function() {
      var floorGeometry = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
      var texture    = new THREE.ImageUtils.loadTexture("../../../images/dirt.jpg");
      var material = new THREE.MeshBasicMaterial( { map:texture } );
      var floor = new THREE.Mesh(floorGeometry, material);
      floor.position.y = 0;
      floor.rotation.x = -Math.PI / 2;
      return floor;
    },

    cube3d : function() {
      var geometry = new THREE.BoxGeometry( .4, .4, .4);
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      return cube;
    },

    starrySky : function() {
      var imagePrefix = "../../../images/galaxy";
      var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
      var imageSuffix = ".jpg";
      var skyGeometry = new THREE.BoxGeometry( 2, 2, 2 );

      var materialArray = [];
      for (var i = 0; i < 6; i++) {
        materialArray.push( new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture( imagePrefix + imageSuffix ),
          side: THREE.BackSide
        }));
      }

        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
      return skyBox;
    },

    renderedMapFromMatrix : function(Map) {
      
    },

    cityScape : function() {
      var imagePrefix = "../../../images/city_";
      var directions  = ["right", "left", "top", "yneg", "front", "back"];
      var imageSuffix = ".jpg";
      var skyGeometry = new THREE.BoxGeometry( 2, 2, 2 );

      var materialArray = [];
      for (var i = 0; i < 6; i++) {
        materialArray.push( new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
          side: THREE.BackSide
        }));
      }

      var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
      var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
      return skyBox;
    },

    desert : function() {
      var imagePrefix = "../../../images/desert_";
      var directions  = ["right", "left", "top", "yneg", "front", "back"];
      var imageSuffix = ".jpg";
      var skyGeometry = new THREE.BoxGeometry( 2, 2, 2 );

      var materialArray = [];
      for (var i = 0; i < 6; i++) {
        materialArray.push( new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
          side: THREE.BackSide
        }));
      }

      var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
      var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
      return skyBox;
    },

    femaleCharacter : "undefined"

  };
});
