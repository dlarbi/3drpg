requirejs.config({
  baseUrl: 'scripts',
  paths: {
    helper: 'helper',
    app: 'app',
    assets: 'app/assets'
  }
});
require(["helper/util","app/ecs", "app/observers", "assets/3dModels", "app/UI", "app/quests"], function(Utilities, APP, Observers, Models, UI, Quests) {
  //we start by loading all the models we need
  var loader = new THREE.ObjectLoader();
  loader.load( "../../../scripts/app/assets/sinon-sword-art-online.json", function( geometry ) {

    // setup models
    geometry.scale.set( 1, 1, 1 );
    Models.femaleCharacter = geometry;



    // start game
    Utilities.init(APP);
    Utilities.mouseInputOn();
    Utilities.keyboardInputOn();
    APP.initialize(APP, Models, UI, Utilities);

    var scene = new APP.Entity();
    scene.addComponent(new APP.Components.Scene());

    var sky = new APP.Entity;
    sky.addComponent(new APP.Components.Model3d(Models.desert()));
    sky.addComponent(new APP.Components.Position(0, 80, 0));
    sky.addComponent(new APP.Components.Size(380));

    var floor = new APP.Entity();
    floor.addComponent(new APP.Components.Model3d(Models.flatFloor()));
    floor.addComponent(new APP.Components.Size(5));
    floor.addComponent(new APP.Components.Position(0, 0, 0));

    var map = new APP.Entity();
    map.addComponent(new APP.Components.Position(0, 0, 0));
    map.addComponent(new APP.Components.Map());
    map.addComponent(new APP.Components.Size(floor.components.Size.size));

    var player = new APP.Entity();
    player.addComponent(new APP.Components.Model3d(Models.femaleCharacter));
    player.addComponent(new APP.Components.Size(.7));
    player.addComponent(new APP.Components.Position(0, 0, 0));
    player.addComponent(new APP.Components.PlayerControlled(player));
    player.addComponent(new APP.Components.Health());
    player.addComponent(new APP.Components.Mass());
    player.addComponent(new APP.Components.Attacker());
    player.addComponent(new APP.Components.Collides(0));
    player.addComponent(new APP.Components.Quests(Quests.QuestSet1));

    var enemy = new APP.Entity();
    enemy.addComponent(new APP.Components.Health());
    enemy.addComponent(new APP.Components.Position(-1.5, 1, 1));
    enemy.addComponent(new APP.Components.Model3d(Models.cube3d()));
    enemy.addComponent(new APP.Components.Size(.7));
    enemy.addComponent(new APP.Components.Collides(0));
    enemy.addComponent(new APP.Components.Mass());
    enemy.addComponent(new APP.Components.QuestGoal("Cube Quest"));
    //enemy.addComponent(new APP.Components.RandomWalker(.08)); //RandomWalker initialized with stepSize;

    window.entityArray = [scene, sky, floor, map, player, enemy];
    APP.Systems.buildMap(entityArray);
    APP.Systems.render3dModel(entityArray);
    APP.Systems.quests(entityArray);
    //We handle impacts by observing collision events with the player object.
    //The collision events are fired by APP.Systems like attackDetection() and collisionDetection()
    Observers.initialize(APP);
    Observers.collision();
    Observers.attack();
    setInterval(function() {
      APP.Systems.physics(entityArray);
      APP.Systems.userInput(entityArray);

      //APP.Systems.randomWalking(entityArray);
      APP.Systems.attackDetection(entityArray);
      APP.Systems.projectiles(entityArray);
      APP.Systems.collisionDetection(entityArray);
      APP.Systems.renderScene(entityArray);
    },30);

  });


});
