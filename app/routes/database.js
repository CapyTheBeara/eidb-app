var DatabaseRoute = Ember.Route.extend({
  model: function(params) {
    return EIDB.openOnly(params.database_name).then(function(db) {
      if (db) { return db; }
      return null;
    });
  },

  setupController: function(controller, model) {
    controller.set('needs', ['application']);

    controller.set('content', model);
    controller.set('controllers.application.currentDbName', model.name);
    controller.set('controllers.application.currentStoreName', null);
  },

  redirect: function(model) {
    if (!model) {
      this.set('controller.controllers.application.errorMessage', 'That database does not exist');
      this.transitionTo('index');
    }
  }
});

export default DatabaseRoute;
