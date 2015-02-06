define(function () {
  var APP;

  return {
    initialize : function(APPLICATION) {
      APP = APPLICATION;
    },

    collision : function() {
      $(window).on('playerCollision', playerCollisionFunctions);
      $(window).on('collision', collisionFunctions);
      function collisionFunctions(evt, entity1, entity2) {
        APP.Systems.entityImpact(evt, entity1, entity2);

      }
      function playerCollisionFunctions(evt, collidedWithEntity) {
        APP.Systems.playerImpact(evt, collidedWithEntity);
        if(typeof collidedWithEntity.components.QuestGoal != "undefined" && APP.getPlayerEntity().components.Quests != "undefined") {
          if(APP.getPlayerEntity().components.Quests.currentQuest.complete == false) {
            if(collidedWithEntity.components.QuestGoal.questName == APP.getPlayerEntity().components.Quests.currentQuest.name) {
              console.log('Quest Completed');
              APP.getPlayerEntity().components.Quests.currentQuest.complete = true;
              APP.Systems.quests([APP.getPlayerEntity()]);
            }
          }
        }

      }
    },

    attack : function() {
      var throttledAttack = _.throttle(APP.Systems.attack, 3000, {trailing:false});
      $(window).on('attack', throttledAttack);
      $(window).on('playerAttack', APP.Systems.playerAttack);
    }

  }
});
