var StoreRoute = Ember.Route.extend({
  model: function(params) {
    return {name: 'cats'};
  },

  setupController: function(controller, model) {
    controller.set('content', model);
    controller.set('controllers.application.currentStoreName', model.name);
  }
});

export default StoreRoute;
