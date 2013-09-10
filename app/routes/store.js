var StoreRoute = Ember.Route.extend({
  model: function(params) {
    return params.store_name;
  },

  setupController: function(controller, storeName) {
    controller.set('storeName', storeName);
    controller.set('controllers.application.currentStoreName', storeName);
  }
});

export default StoreRoute;
