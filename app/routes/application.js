var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.setContent();
  }
});

export default ApplicationRoute;
