var DatabaseRoute = Ember.Route.extend({
  model: function(params) {
    return EIDB.open(params.database_name).then(function(db) {
      return db;
    });
  },

  setupController: function(controller, model) {
    controller.set('needs', ['application']);

    controller.set('content', model);
    controller.set('controllers.application.currentDbName', model.name);
    controller.set('controllers.application.currentStoreName', null);
  }
});

export default DatabaseRoute;
