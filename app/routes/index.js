var IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('needs', ['application']);
    controller.set('controllers.application.currentDbName', null);
    controller.set('controllers.application.currentStoreName', null);
  }
});

export default IndexRoute;
