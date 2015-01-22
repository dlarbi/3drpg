requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["helper/util","app/ecs", "app/observers", "assets/3dModels", "app/UI"], function(Utilities, APP, Observers, Models, UI) {
  //we start by loading all the models we need
  var loader = new THREE.ObjectLoader();
  loader.load( "../../../scripts/app/assets/sinon-sword-art-online.json", function( geometry ) {

    // setup models
    geometry.scale.set( 1, 1, 1 );
    Models.femaleCharacter = geometry;



    // start game
    Utilities.mouseInputOn();
    Utilities.keyboardInputOn();
    APP.initialize(APP, Models, UI, Utilities);

    var scene = new APP.Entity();
    scene.addComponent(new APP.Components.Scene());

    var player = new APP.Entity();
    player.addComponent(new APP.Components.Model3d(Models.femaleCharacter));
    player.addComponent(new APP.Components.Size(.7));
    player.addComponent(new APP.Components.Position(0, 0, 0));
    player.addComponent(new APP.Components.PlayerControlled(player));
    player.addComponent(new APP.Components.Health());
    player.addComponent(new APP.Components.Collides(0));

    var enemy = new APP.Entity();
    enemy.addComponent(new APP.Components.Health());
    enemy.addComponent(new APP.Components.Position(-1.5, 1, 1));
    enemy.addComponent(new APP.Components.Model3d(Models.cube3d()));
    enemy.addComponent(new APP.Components.Size(.7));
    enemy.addComponent(new APP.Components.Collides(0));
    //enemy.addComponent(new APP.Components.RandomWalker(20)); //RandomWalker initialized with stepSize;

    window.entityArray = [scene, player, enemy];
    APP.Systems.render3dModel(entityArray);

    //We handle impacts by observing collision events with the player object.
    //The collision events are fired by APP.Systems like attackDetection() and collisionDetection()
    Observers.initialize(APP);
    Observers.collision();
    setInterval(function() {

      APP.Systems.collisionDetection(entityArray);
      APP.Systems.physics(entityArray);
      APP.Systems.userInput(entityArray);
      APP.Systems.renderScene(entityArray);
    },30);

  });


/*
  Utilities.mouseInputOn();
  Utilities.keyboardInputOn();
  APP.initialize(APP, Models, UI, Utilities);

  var player = new APP.Entity();
  var enemy = new APP.Entity();
  var building = new APP.Entity();

  var map = new APP.Entity();
  map.addComponent(new APP.Components.Position(1, 2, 1));
  map.addComponent(new APP.Components.Map());
  map.addComponent(new APP.Components.CSSModel({modelData : ''}));

  player.addComponent(new APP.Components.Health());
  player.addComponent(new APP.Components.Size(100));
  player.addComponent(new APP.Components.Position(20, 20, 1));
  player.addComponent(new APP.Components.PlayerControlled(player));
  player.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  player.addComponent(new APP.Components.Attacker());
  player.addComponent(new APP.Components.Collides(0));

  enemy.addComponent(new APP.Components.Health());
  enemy.addComponent(new APP.Components.Size(100));
  enemy.addComponent(new APP.Components.Position(600, 300, 1));
  enemy.addComponent(new APP.Components.CSSModel(Models.cssCube()));
  enemy.addComponent(new APP.Components.Collides(0));
  enemy.addComponent(new APP.Components.RandomWalker(20)); //RandomWalker initialized with stepSize;

  var coin = new APP.Entity();
  coin.addComponent(new APP.Components.Position(100, 200, 1));
  coin.addComponent(new APP.Components.Size(50));
  coin.addComponent(new APP.Components.CSSModel(Models.cssCoin()));
  coin.addComponent(new APP.Components.Collides(1));
  coin.addComponent(new APP.Components.Coin());

  //Add/Remove health component from building to make the building destroyable. Same way as an enemy.
  //Sweet example of this architecture's awesome ability to maintain separation of concerns.
  building.addComponent(new APP.Components.Health());
  building.addComponent(new APP.Components.Size(400));
  building.addComponent(new APP.Components.Position(1600, 300, 1));
  building.addComponent(new APP.Components.CSSModel(Models.cssBigBuilding()));
  building.addComponent(new APP.Components.Collides(0));
  enemy.addComponent(new APP.Components.Attacker()); //We pass APP  and models so we can create new entities and components for bullets/arrows/etc within our attack methods

  window.entityArray = [map, player, enemy, coin, building];
  APP.Systems.buildMap(entityArray);
  APP.Systems.renderCSSModel(entityArray); //We render CSS models once, outside of game loop.  Only update positions and rotations in game loop.

  //We handle impacts by observing collision events with the player object.
  //The collision events are fired by APP.Systems like attackDetection() and collisionDetection()
  Observers.initialize(APP);
  Observers.collision();
  Observers.attack();
  setInterval(function() {
    APP.Systems.death(entityArray);

    APP.Systems.projectiles(entityArray);
    APP.Systems.attackDetection(entityArray);
    APP.Systems.randomWalking(entityArray);
    APP.Systems.collisionDetection(entityArray);
    APP.Systems.userInput(entityArray);
    APP.Systems.positionCSSModel(entityArray);
    //APP.Systems.render(entityArray); //This function renders things on the canvas.
  }, 80);
*/
});
