define(function () {
  ECS = {};
  ECS.Entities = {};
  ECS.Entities.count = 0;
  //Whenever you want to know which entity the player is.  This comes in handy a lot.
  ECS.Entities.Player = 0;
  ECS.Scene = null;

  return {
    //The references to APP and Models are so we can build entities inside our systems. (Ie creating projectiles in an attack system)
    initialize : function(APPLICATION, Models, UI, Utilities) {
      ECS.APP = APPLICATION;
      ECS.Models = Models;
      ECS.UI = UI;
      ECS.Utilities = Utilities;
    },
    Entity : function() {
      this.id = (+new Date()).toString(16) +
      (Math.random() * 100000000 | 0).toString(16) +
      ECS.Entities.count;

      ECS.Entities.count++;
      this.components = {};

      this.addComponent = function(component) {
        this.components[component.name] = component;
        return this;
      }

      this.removeComponent = function(component) {
        var name = component;
        if(typeof component === 'function'){
          name = component.prototype.name;
        }
        delete this.components[name];
        return this;
      }

      this.print = function print () {
        console.log(JSON.stringify(this, null, 4));
        return this;
      };

    },

    Components : {
      Health : function(value) {
        this.name = 'Health';
        var value = value || 20;
        this.value = value;
        return this;
      },
      TakesDamage : function(multiplier){
        this.name = 'TakesDamage';
        this.multiplier = multiplier;
        return this;
      },
      Size: function(size) {
        this.name = 'Size';
        this.size = size;
        return this;
      },
      Mass: function() {
        this.name = 'Mass';
        this.mass = 1;
        return this;
      },
      Position : function(x,y,z) {
        this.name = 'Position';
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      },
      Velocity : function() {
        this.name = 'Velocity';
        this.dX = 0;
        this.dY = 0;
        return this;
      },
      PlayerControlled : function(player) {
        this.name = 'PlayerControlled';
        if(typeof player != "undefined") {
          ECS.Entities.Player = player;
        }
        return this;
      },
      //This model component is mean to handle data of the form
      //[{x, y, z, rgba}, {x, y, z, rgba}, {x, y, z, rgba}, ... ]
      Model : function(modelData) {
        this.name = 'Model';
        this.data = modelData;
        return this;
      },
      Model3d : function(model){
        this.name = "Model3d";

        this.model = model;
        return this;
      },
      CSSModel : function(model) {
        this.name = "CSSModel";
        this.model = model.modelData;
        this.DOMReference = "undefined";
        return this;
      },
      Collides : function(permeability) {
        this.name = "Collides";
        this.damage = 0;
        this.permeability = permeability;
        return this;
      },
      RandomWalker : function(stepSize) {
        this.name = "RandomWalker";
        this.stepSize = stepSize;
        return this;
      },
      Attacker : function() {
        this.name = "Attacker";
        return this;
      },
      Projectile : function(x, y) {
        this.name = "Projectile";
        var timer = timer || 50;
        this.destination = {x:x, y:y},
        this.timer = timer;
        this.damage = 1;
        this.impactAnimation = '<img class="impactAnimation" src="./images/explode.gif"/>';
        return this;
      },
      Coin : function() {
        this.name = "Coin";
        var value = value || 5;
        this.value = value;
        return this;
      },
      Map : function() {
        this.name = "Map";
        this.type = "Dungeon";
        this.followPlayer = true;
        this.mapMatrix = {
          1: [0,0,1,0,0,0,1,1,0,0,1],
          2: [0,0,1,0,0,0,1,0,1,0,1],
          3: [0,0,1,0,0,0,1,0,1,0,1],
          4: [0,0,1,0,0,0,1,0,1,0,1],
          5: [0,0,1,0,0,0,1,0,1,0,1],
          6: [0,0,1,0,0,0,1,0,1,0,1],
          7: [0,0,1,0,0,0,1,0,1,0,1],
          8: [0,0,1,0,0,0,1,0,1,0,1],
          9: [0,0,1,0,0,0,1,0,1,0,1],
          10:[0,0,0,0,0,0,1,0,1,0,1],
        }
        return this;
      },
      Scene : function() {
        this.name = "Scene";
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor('#CCCCCC');
        this.camera.position.z = -5;
        this.camera.position.y = 2;
        this.cameraFollows = true;
        var controls = new THREE.OrbitControls(this.camera)
        var ambientLight = new THREE.AmbientLight(0xBBBBBB);
        this.scene.add(ambientLight);
        document.body.appendChild( this.renderer.domElement );
        ECS.Scene = this;
        return this;
      }
    },

    Systems : {
      renderScene : function(entities) {
        ECS.APP.Systems.positionModels(entityArray);
        var currentEntity;
        var posX;
        var posY;
        var posZ;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Scene != "undefined") {
            if(currentEntity.components.Scene.cameraFollows == true) {
              posX = ECS.Entities.Player.components.Position.x
              ECS.Entities.Player.components.Model3d.model.add(ECS.Scene.camera)
            }
            currentEntity.components.Scene.renderer.render(currentEntity.components.Scene.scene, currentEntity.components.Scene.camera);
          }
        }
      },

      render3dModel : function(entities) {
        var currentEntity;
        var size;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Model3d != "undefined") {
            if(typeof currentEntity.components.Size != "undefined") {
              size = currentEntity.components.Size.size;
              currentEntity.components.Model3d.model.scale.set(size,size,size)
            }
            ECS.Scene.scene.add(currentEntity.components.Model3d.model)
          }
        }
      },

      positionModels : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Model3d != "undefined" && typeof currentEntity.components.Position != "undefined") {
            currentEntity.components.Model3d.model.position.x = currentEntity.components.Position.x;
            currentEntity.components.Model3d.model.position.y = currentEntity.components.Position.y;
            currentEntity.components.Model3d.model.position.z = currentEntity.components.Position.z;
          }
        }
      },

      physics : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Model3d != "undefined" && typeof currentEntity.components.Position != "undefined") {
            ECS.APP.Systems.gravity(currentEntity)
          }
        }
      },

      gravity : function(entity) {
        if(typeof entity.components.Mass != "undefined") {
          if(entity.components.Position.y > 0) {
            entity.components.Position.y-=.1;
          } else {
            entity.components.Position.y = 0;
          }
        }

      },
      renderCSSModel : function(entities) {
        var el;
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          //Render CSSModels but not the World, we handle worlds elsewhere for now
          if(typeof currentEntity.components.CSSModel != "undefined" && typeof currentEntity.components.Map == "undefined") {
            //dont render the same element if it exists
            if(!$('[data-entity="'+currentEntity.id+'"]').length) {
              var type = currentEntity.components.CSSModel.type;
                el = $(currentEntity.components.CSSModel.model);
                el.attr('data-entity', currentEntity.id);
                el.css('width', currentEntity.components.Size.size + 'px')
                el.css({
                  width: currentEntity.components.Size.size + 'px',
                  height: currentEntity.components.Size.size + 'px',
                  left: -currentEntity.components.Size.size/2.2 + 'px',
                  top: -currentEntity.components.Size.size/2.2 + 'px'
                })
                $('#map').append(el);
            }
          }
          if(typeof currentEntity.components.Map != "undefined") {
            $('#map').attr('data-entity', currentEntity.id);
          }
        }
      },

      buildMap : function(entities) {
        var map = $('#map');
        var currentEntity;
        var mapMatrix;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          //type might be dungeon.  We will add a path through the dungeon and the collideable obstacles into the world.  ie. walls, rivers, terrain, etc.
          if(typeof currentEntity.components.Map != "undefined") {
            fullMapMatrix = currentEntity.components.Map.mapMatrix;
            for(var x = 1; x < 11 ;x++){
            var mapMatrixRow = fullMapMatrix[x];
            var obstacle;
            var obstacleXLocation;
            var obstacleYLocation;
            var obstacleEntityCollection = [];
            var mapMatrixN = mapMatrixRow.length;
            var mapMatrixSectionWidth = map.width()/mapMatrixN;
            var mapMatrixSectionHeight = map.height()/11;
            console.log(mapMatrixSectionHeight)
            for(var n = 0; n < mapMatrixN; n++){
              obstacle = mapMatrixRow[n];
              obstacleXLocation = n * mapMatrixSectionWidth;
              if(obstacle == 1) {
                //map.append('<div style="position:fixed; width:200px; height:200px; background:#000; top:0; left:'+obstacleXLocation+'px;"></div>');
                obstacleEntityCollection[n] = new ECS.APP.Entity();
                obstacleEntityCollection[n].addComponent(new ECS.APP.Components.Collides(false));
                obstacleEntityCollection[n].addComponent(new ECS.APP.Components.Size(mapMatrixSectionWidth));
                obstacleEntityCollection[n].addComponent(new ECS.APP.Components.Position(obstacleXLocation, mapMatrixSectionHeight*x, 1));
                //obstacleEntityCollection[n].print();
                var cssModel = ECS.Models.cssCube();
                cssModel.modelData = '<div style="position:fixed; z-index:0; height:'+mapMatrixSectionWidth+'px; background:#000;pointer-events:none;"></div>'
                obstacleEntityCollection[n].addComponent(new ECS.APP.Components.CSSModel(cssModel));
                entityArray.push(obstacleEntityCollection[n]);
              }
            }
          }

          }
        }
      },

      positionCSSModel : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.CSSModel != "undefined") {
            var x = currentEntity.components.Position.x;
            var y = currentEntity.components.Position.y;
            var z = currentEntity.components.Position.z;

            if($('[data-entity="'+currentEntity.id+'"]').hasClass('animate')) {
              $('[data-entity="'+currentEntity.id+'"]').css({
              left:x,
              top: y
              });
            } else {
              $('[data-entity="'+currentEntity.id+'"]').css({
                '-webkit-transform' : 'translate('+x+'px,'+y+'px)',
                '-moz-transform'    : 'translate('+x+'px,'+y+'px)',
                '-ms-transform'     : 'translate('+x+'px,'+y+'px)',
                '-o-transform'      : 'translate('+x+'px,'+y+'px)',
                'transform'         : 'translate('+x+'px,'+y+'px)'
              });
            }
          }
        }
      },

      userInput : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.PlayerControlled != "undefined") {

            //at this point our player component's position starts to depend on our graphics engine's
            //position of our model..  This is backwards and should be fixed, but it works for now.
            currentEntity.components.Model3d.model.translateZ(window.userInputZ)
            currentEntity.components.Position.x = currentEntity.components.Model3d.model.position.x;
            currentEntity.components.Position.y = currentEntity.components.Model3d.model.position.y;
            currentEntity.components.Position.z = currentEntity.components.Model3d.model.position.z;

            if(window.userTurnL != 0) {
              currentEntity.components.Model3d.model.rotateOnAxis( new THREE.Vector3(0,1,0), .2 )
            }
            if(window.userTurnR != 0) {
              currentEntity.components.Model3d.model.rotateOnAxis( new THREE.Vector3(0,-1,0), .2 )
            }
          }

          if(typeof currentEntity.components.Map != "undefined") {
            if(currentEntity.components.Map.followPlayer == true) {
              currentEntity.components.Position.x = -ECS.Entities.Player.components.Position.x;
              currentEntity.components.Position.y = -ECS.Entities.Player.components.Position.y;
              currentEntity.components.Position.z-=window.userInputZ;
            }

          }
        }
        window.userInputX = window.userInputY = window.userTurnL = window.userTurnR = window.userInputZ = 0;
      },

      collisionDetection : function(entities) {
        var currentEntity;
        var otherEntity;
        var cssPos1;
        var cssPos2;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Collides != "undefined"){

            for(var j = 0; j < entities.length; j++){
              otherEntity = entities[j];
              if(typeof otherEntity.components.Collides != "undefined" && otherEntity.id != currentEntity.id){
                var xDist = Math.abs(currentEntity.components.Position.x - otherEntity.components.Position.x);
                var yDist = Math.abs(currentEntity.components.Position.y - otherEntity.components.Position.y);
                var zDist = Math.abs(currentEntity.components.Position.z - otherEntity.components.Position.z);

                if(xDist < currentEntity.components.Size.size/1.5 && yDist < currentEntity.components.Size.size/1.5 && zDist < currentEntity.components.Size.size/1.5) {
                  if(otherEntity.id == ECS.Entities.Player.id) {

                      $(window).trigger('playerCollision', [currentEntity]);

                  }
                  if(currentEntity.id != ECS.Entities.Player.id) {
                    //We dont trigger a collision if both elements are projectiles
                    if (typeof currentEntity.components.Projectile == "undefined" || typeof otherEntity.components.Projectile == "undefined") {


                        //console.log(currentEntity)
                        $(window).trigger('collision', [otherEntity, currentEntity]);


                    }

                  }

                }
              }

            }

          }
        }
      },


      randomWalking : function(entities) {
          //Adds a random X and a random Y value to the position of any entity with the RandomWalker component
          //The dude walks around all crazy, the paramenter defined in the component is basically his speed. Doesn't let it walk out of bounds
          var currentEntity;
          for(var i = 0; i < entities.length; i++) {
            currentEntity = entities[i];
            if(typeof currentEntity.components.RandomWalker != "undefined") {
              var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
              var stepSize = currentEntity.components.RandomWalker.stepSize;

                currentEntity.components.Position.x+=(plusOrMinus*stepSize);


              plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                currentEntity.components.Position.z+=(plusOrMinus*stepSize);

            }
          }
      },

      playerImpact: function(evt, collidedWithEntity) {

        if(typeof collidedWithEntity.components.Collides != "undefined") {
          if(collidedWithEntity.components.Collides.permeability == 0 && ECS.Entities.Player.components.Collides.permeability == 0) {
            var playerX = ECS.Entities.Player.components.Position.x;
            var playerZ = ECS.Entities.Player.components.Position.z;
            var collX = collidedWithEntity.components.Position.x;
            var collZ = collidedWithEntity.components.Position.z;

            if(playerZ < collZ) {
              ECS.Entities.Player.components.Position.z = ECS.Entities.Player.components.Position.z - .06;
            } else {
              ECS.Entities.Player.components.Position.z = ECS.Entities.Player.components.Position.z + .06;
            }
            if(playerX < collX) {
              ECS.Entities.Player.components.Position.x = ECS.Entities.Player.components.Position.x - .06;
            } else {
              ECS.Entities.Player.components.Position.x = ECS.Entities.Player.components.Position.x + .06;
            }

          }
        }

        if(typeof collidedWithEntity.components.Coin != "undefined") {
          ECS.Entities.Player.components.Health.value+=collidedWithEntity.components.Coin.value;
          $('[data-entity="'+collidedWithEntity.id+'"]').remove();
          //To destroy an entity, we remove all of its components.  The entities with no components can be cleaned up later.  Must figure this out.
          collidedWithEntity.components = {};
        } else if(typeof collidedWithEntity.components.Projectile != "undefined" || typeof collidedWithEntity.components.Attacker != "undefined") {
          $('[data-entity="'+collidedWithEntity.id+'"]').remove();
          ECS.Entities.Player.components.Health.value-=1;
          collidedWithEntity.components = {};
        }
        ECS.UI.updatePlayerHealth(ECS.Entities.Player.components.Health.value);
      },

      entityImpact: function(evt, entity1, entity2) {
        //This branch represents a projectile entity1 colliding with an entity2 with health
        if(typeof entity1.components.Projectile != "undefined") {
          $('[data-entity="'+entity1.id+'"]').css('background', 'none!important');
          $('[data-entity="'+entity1.id+'"]').html(currentEntity.components.Projectile.impactAnimation);

          if(typeof entity2.components.Health != "undefined") {
            entity2.components.Health.value-=entity1.components.Projectile.damage;
            entity1.components = {};
            setTimeout(function() {
              $('[data-entity="'+entity1.id+'"]').remove();
            }, 200)
            ECS.UI.updateEntityHealth(entity2);
          }
        }
        //we dont want to bounce projectiles off of things.
        if(typeof entity1.components.Projectile == "undefined" && typeof entity2.components.Projectile == "undefined") {
          if(typeof entity1.components.RandomWalker != "undefined") {
            var entity1X = entity1.components.Position.x;
            var entity1Y = entity1.components.Position.y;
            var entity2X = entity2.components.Position.x;
            var entity2Y = entity2.components.Position.y;
            if(entity1Y < entity2Y) {
              entity1.components.Position.y = entity1.components.Position.y - .06;
            } else {
              entity1.components.Position.y = entity1.components.Position.y + .06;
            }
            if(entity1X < entity2X) {
              entity1.components.Position.x = entity1.components.Position.x - .06;
            } else {
              entity1.components.Position.x = entity1.components.Position.x + .06;
            }
          }
        }
      },

      death: function(entities){
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Health != "undefined") {
            if(currentEntity.components.Health.value <= 0) {
              currentEntity.components = {};
              $('[data-entity="'+currentEntity.id+'"]').remove();
            }
          }
        }
      },

      attack: function(evt, attackingEntity) {

          var projectile = new ECS.APP.Entity();
          projectile.addComponent(new ECS.APP.Components.Position(attackingEntity.components.Position.x + 120, attackingEntity.components.Position.y + 120, 1));
          projectile.addComponent(new ECS.APP.Components.CSSModel(ECS.Models.cssBullet()));
          projectile.addComponent(new ECS.APP.Components.Collides());
          projectile.addComponent(new ECS.APP.Components.Size(20));
          projectile.addComponent(new ECS.APP.Components.Projectile(ECS.Entities.Player.components.Position.x, ECS.Entities.Player.components.Position.y));


        window.entityArray.push(projectile)
        ECS.APP.Systems.renderCSSModel(entityArray);
      },

      playerAttack : function(evt, attackingEntity) {
        var projectile = new ECS.APP.Entity();
        projectile.addComponent(new ECS.APP.Components.Position(attackingEntity.components.Position.x + 120, attackingEntity.components.Position.y + 120, 1));
        projectile.addComponent(new ECS.APP.Components.CSSModel(ECS.Models.cssBullet()));
        projectile.addComponent(new ECS.APP.Components.Collides());
        projectile.addComponent(new ECS.APP.Components.Size(20));
        originX = attackingEntity.components.Position.x;
        originY = attackingEntity.components.Position.y;
        destinationX = window.clickX;
        destinationY = window.clickY;

        var difsquaredX = (destinationX - originX)*(destinationX - originX);
        var difsquaredY = (destinationY - originY)*(destinationY - originY);

        var amp = Math.sqrt(difsquaredX + difsquaredY);

        projectile.addComponent(new ECS.APP.Components.Projectile(window.clickX, window.clickY));
        window.clickX = 0;
        window.clickY = 0;
        window.entityArray.push(projectile)
        ECS.APP.Systems.renderCSSModel(entityArray);
      },

      attackDetection : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Attacker != "undefined") {
            if(typeof currentEntity.components.PlayerControlled != "undefined"){
              if(window.userInputLClick == 1) {
                $(window).trigger('playerAttack', [currentEntity]);
                window.userInputLClick = 0;
              }
            } else {
              $(window).trigger('attack', [currentEntity]);
            }

          }
        }
      },

      projectiles : function(entities) {
        var currentEntity;
        for(var i = 0; i < entities.length; i++) {
          currentEntity = entities[i];
          if(typeof currentEntity.components.Projectile != "undefined") {
            currentEntity.components.Position.x = currentEntity.components.Projectile.destination.x;
            currentEntity.components.Position.y = currentEntity.components.Projectile.destination.y;
            $('[data-entity="'+currentEntity.id+'"]').css('transition', '1s linear all');

            currentEntity.components.Projectile.timer--;

            if(currentEntity.components.Projectile.timer <= 0) {
              $('[data-entity="'+currentEntity.id+'"]').remove();
              currentEntity.components = {};
            }

          }
        }
      }
    },

    getEntitiesCount : function() {
      return ECS.Entities.count;
    }
  };
});
