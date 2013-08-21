var StoreRoute = Ember.Route.extend({
  model: function(params) {
    return {id: params.store_id};
  },

  setupController: function(controller, model) {
    var dbName = this.controllerFor('application').get('selectedDb');
    controller.set('dbName', dbName);
    controller.set('storeName', model.id);
    controller.getData();
  }
});

export default StoreRoute;