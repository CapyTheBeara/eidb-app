import { _eidbGetTree, _eidbDeleteAllDbs } from 'appkit/helpers/utils';

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
    },

    htmlClicked: function(evt) {
      if ($('#command-form-li').has(evt.target).length < 1) {
        this.send('hideCommandList');
      }
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

// this will allow the command list to be closed when clicking
// outside of the Ember app
$('html').click(function(evt) {
  Ember.Instrumentation.instrument('html.click', evt);
});

export default ApplicationController;
