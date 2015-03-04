#3d Entity Component Systems RPG game engine
![Alt text](/images/screenshot2.jpg?raw=true "Optional Title")


A framework for building a 3d RPG game in the browser. You can download the archive, and run cubeworld.html example. Must be running on a webserver.

Started as an integration of THREE.js webgl graphics into the js ECS engine I put here github.com/dlarbi/Entity-Component-System. (The original has its graphics rendered with CSS). Also some new behaviors (see list of components and systems that are now included).

3drpg has 3 main classes for entities, components, and systems.

####Entities

Every thing in your gameworld is an entity. A new entity object is constructed like:

    var player = new APP.Entity();
    var enemy = new APP.Entity();
    var map = new APP.Entity();
    var sky = new APP.Entity();

An entity object has a few important methods and properties.

    id                  //unique to this entity
    addComponent()      //attaches a component to this entity.  ie. Position, Health, Size
    removeComponent()
    print()             //prints information about the entity to the console

####Components

In order to define the characteristics of an entity in your gameworld, you attach components to it. Components are objects that only hold data, no methods. For example, say you want an entity to feel the effects of gravity:

    var player = new APP.Entity();
    player.addComponent(new APP.Components.Mass());

We could also add a position to our player. The position Component has 3 properties only: x, y, z. Like all components, the position component does not contain any methods. An entity's position state is always changed by a system.

    player.addComponent(new APP.Components.Position(1, 1, 1));

There are many components available in the engine to add to your entities. You can combine them for silly results! The ECS architecture avoids crazy inheritence chains by composing objects instead of implementing interfaces/abstract/base classes.  For example if you want a player controlled coin, you create an entity, and implement:

    var entity = new APP.Entity();
    entity.addComponent(new APP.Components.PlayerControlled());
    entity.addComponent(new APP.Components.Coin());

Unfortunately I don't have time at the moment to detail all of the components' properties, but you can experiment by attaching components to an entity, and they using entity.print().  You can make some crazy objects in your game world, and notice how deep inheritence chains are avoided.
    
    APP.Components.Health(value)
    APP.Components.TakesDamage(multiplier)
    APP.Components.Size(scale)
    APP.Components.Collides(permeability)                                       //Will fire collision events on impact in world. 1 or 0 for pass through or rigid.
    APP.Components.Mass()
    APP.Components.Position(x,y,z)
    APP.Components.Velocity(dx, dy, dz)
    APP.Components.PlayerControlled(player)
    APP.Components.Model(modelData)                                             //This model component is mean to handle data of the form [{x, y, z, rgba}, {x, y, z, rgba}, {x, y, z, rgba}, ... ]
    APP.Components.Model3d(modelData)                                           //3d models in the three.js json format
    APP.Components.CSSModel(model)                                              //You can render things with CSS instead
    APP.Components.RandomWalker(stepSize)                                       //The entity walks randomly around
    APP.Components.Attacker()                                                   //The entity can attack
    APP.Components.Projectile(destinationX, destinationY, destinationZ)
    APP.Components.Coin()                                                       //This is a good example of a bad component.  It makes an entity disappear, and give you 5+ health on collision.  This would be much better in more general terms that could be combined to describe a coin.
    APP.Components.Map()                                                        //Right now this has a default map matrix, but will soon accept a matrix as an argument to render a map
    APP.Components.Scene()                                                      //Has a bunch of default settings that render the world, cameras, etc.
    APP.Components.Quests(questSet)                                             //Can be given to a player entity, and quest system will be active
    APP.Components.QuestGoal(questName)

![Alt text](/images/screenshot1.jpg?raw=true "Optional Title")

####Systems

Most systems are called each frame of the game loop, and accept an array of entity objects as an argument. Other, specific systems are meant to be activated due to an event, instead of each frame, or they are executed only once. For instace, if you make a system that builds and renders a map, you probably wouldn't call this Map() system every frame. Systems that depend on events are called from our Observer class (defined below), and accept an event, and usually a small set of entity objects involved in the event.

    APP.Systems.renderScene(entities)                                           //Some systems like renderScene() are executed once, outside of the game loop.
    APP.Systems.render3dModel(entities)
    APP.Systems.positionModels(entities)                                        //Entities are positioned in the world according to their Position component.
    APP.Systems.physics(entities)
    APP.Systems.gravity(entity)                                                 //Implemented in APP.Systems.Physics()
    APP.Systems.collisionDetection(entities)
    APP.Systems.attackDetection(entities)                                       //Detects when entities should attack.  For player on click.  For enemies when you are within their range.
    APP.Systems.projectiles(entities)                                           //Makes things fly through the air dependent on their velocity (dx, dy, dz)
    APP.Systems.randomWalking(entities)
    APP.Systems.renderCSSModel(entities)
    APP.Systems.buildMap(entities)
    APP.Systems.positionCSSModel(entities)
    APP.Systems.userInput(entities)                                             //game starts listening for input from controls
    APP.Systems.playerImpact(event, collidedWithEntity)                         //Some systems like playerImpact() are executed at runtime, as the result of an event (in this case a collision)
    APP.Systems.entityImpact(event, entity1, entity2)                           //We separated player impact events from events between other entities
    APP.Systems.quests(entities)
    APP.Systems.death(entities)                                                 //Removes the entity from the world and removes all its components
    APP.Systems.attack(event, attackingEntity)
    APP.Systems.playerAttack(event, attackingEntity)

Systems are where all of your game logic should live. Each frame of your game, a system loops through all the entities in the world, and applies its logic to the entities that contain components the system has registered. Here is an example game that has one entity, that experiences gravity (it doesn't have a model, or any other properties, but it's Y position will naturally decrease towards 0 each frame).

    player.addComponent(new APP.Components.Position(1, 10, 1));
    player.addComponent(new APP.Components.Mass());
    
    //You will see player.components.position.y = 10;
    player.print();
    
    var entities = [player, enemy, map, sky];
    
     //Some systems like renderScene(), and buildMap() are meant to be executed once.
    APP.Systems.renderScene(entities)                                          
    APP.Systems.buildMap(entities) 
    
    //Your game loop
    setInterval(function() {
    
      APP.Systems.Physics(entities);
    
      //You will see player.components.position.y = 0 after a few iterations
      player.print()           
    
    }, 50);

####Observers

We have observers to handle when to execute attack and collision behaviors.

    Observers.initialize(APP);
    Observers.collision();  //Without using this collision observer collision events will still fire, but collision behaviors defined by APP.Systems.playerImpact()/APP.Systems.entityImpact() will not.
    Observers.attack();
