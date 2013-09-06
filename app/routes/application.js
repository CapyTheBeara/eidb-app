var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.setContent();

    // this will allow the command list to be closed
    // when clicking outside of the Ember app
    $('html').click(function(evt) {
      Ember.Instrumentation.instrument('html.click', evt);
    });

    Ember.Instrumentation.subscribe('html.click', {
      before: function(name, timestamp, payload) {
        controller.send('htmlClicked', payload);
      },
      after: function(){}
    });

    EIDB.registerErrorHandler(function(e) {
      Ember.Instrumentation.instrument('eidb.error', e);
    });

    Ember.Instrumentation.subscribe('eidb.error', {
      before: function(name, timestamp, payload) {
        controller.send('eidbErrorReceived', payload);
      },
      after: function(){}
    });
  },

  actions: {
    willTransition: function(transition) {
      this.set('controller.errorMessage', null);
    }
  }
});

export default ApplicationRoute;
