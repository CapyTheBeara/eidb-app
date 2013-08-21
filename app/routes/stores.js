var StoresRoute = Ember.Route.extend({
  dbName: null,

  model: function(params) {
    return {id: params.database_id};
  },

  setupController: function(controller, model) {
    this.controllerFor('application').set('selectedDb', model.id);
    controller.set('selectedDb', model.id);
    controller.getStoreNames();
  }
});

export default StoresRoute;