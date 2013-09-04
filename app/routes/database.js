var DatabaseRoute = Ember.Route.extend({
  model: function(params) {
    return EIDB.open(params.database_name).then(function(db) {
      return db;
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
    controller.setStores();
  }
});

export default DatabaseRoute;
