import { _eidbGetTree, _eidbDeleteAllDbs } from 'appkit/helpers/utils';

var ApplicationController = Ember.ArrayController.extend({
  commandListVisible: false,
  commandLastSubmitted: null,
  currentDbName: null,
  currentStoreName: null,
  errorMessage: null,
  notifyMessage: null,

  setContent: function() {
    var controller = this;

    _eidbGetTree(function(res) {
      controller.set('content', res);
    });
  }.observes('commandLastSubmitted'),

  actions: {
    markCommandSubmitted: function() {  // triggered by command-form component
      this.set('errorMessage', null);
    },

    markCommandResulted: function() {  // triggered by command-form component
      this.set('commandLastSubmitted', new Date());
    },

    handleHtmlClick: function(evt) {  // via Instrumentation in ApplicationRoute
      if ($('#command-form-li').has(evt.target).length < 1) {
        this.set('commandListVisible', false);
      }
    },

    displayError: function(e) {  // via Instrumentation in ApplicationRoute
      var message = "Error";
      if (e && e.name) {
        message = message + " : " + e.name;
      }
      if (e && e.message) {
        message = message + " - " + e.message;
      }

      this.set('errorMessage', message);
    },

    deleteAllDbs: function() {  // via _tree template
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
