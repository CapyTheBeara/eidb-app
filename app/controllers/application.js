import { _eidbGetTree, _eidbDeleteAllDbs } from 'appkit/helpers/utils';

var ApplicationController = Ember.ArrayController.extend({
  commandListVisible: false,
  commandLastSubmitted: null,
  currentDbName: null,
  currentStoreName: null,
  errorMessage: null,

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
    },

    htmlClicked: function(evt) {
      if ($('#command-form-li').has(evt.target).length < 1) {
        this.send('hideCommandList');
      }
    },

    eidbErrorReceived: function(e) {
      var message = "An error occurred";
      if (e && e.name) {
        message = message + " : " + e.name;
      }
      if (e && e.message) {
        message = message + " - " + e.message;
      }

      this.set('errorMessage', message);
    },

    deleteAllDbs: function() {
      var controller = this;

      if (window.confirm('Are you sure')) {
        _eidbDeleteAllDbs(function() {
          controller.set('commandLastSubmitted', new Date());
        });
      }
    }
  }
});

export default ApplicationController;
