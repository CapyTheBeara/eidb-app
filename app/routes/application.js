var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.setContent();

    Ember.Instrumentation.subscribe('html.click', {
      before: function(name, timestamp, payload) {
        controller.send('htmlClicked', payload);
      },
      after: function(){}
    });
  }
});

export default ApplicationRoute;
