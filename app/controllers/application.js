var ApplicationController = Ember.ObjectController.extend({
  commandListVisible: false,

  actions: {
    hideCommandList: function() {
      this.set('commandListVisible', false);
    }
  }
});

export default ApplicationController;
