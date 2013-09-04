import { _eidbGetTree } from 'appkit/helpers/utils';

var ApplicationController = Ember.ArrayController.extend({
  commandListVisible: false,
  commandLastSubmitted: null,

  setContent: function() {
    var controller = this;

    _eidbGetTree(function(res) {
      controller.set('content', res);
    });
  }.observes('commandLastSubmitted'),

  actions: {
    hideCommandList: function() {
      this.set('commandListVisible', false);
    },

    commandSubmitted: function() {
      this.set('commandLastSubmitted', new Date());
    }
  }
});

export default ApplicationController;
