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
  }.observes('commandLastSubmitted', 'currentDbName'),

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
          controller.transitionToRoute('index');
        });
      }
    },

    generateExample: function() {
      var self = this,
          names = ['Stan', 'Kyle', 'Kenny', 'Eric', 'Butters'],
          colors = ['red', 'green', 'blue'],
          ages = [8, 9],
          records = [],
          dbName = 'eidb',
          storeName = 'kids';

      for (var i=0; i<100; i++) {
        records.push({
          name: names[i%names.length],
          color: colors[i%colors.length],
          age: ages[i%ages.length],
        });
      }

      records.push({name: "Chef", color: "yellow", age: "unknown"});

      EIDB.createObjectStore(dbName, storeName).then(function() {
        return EIDB.addRecord(dbName, storeName, records);
      }).then(function() {
        self.set('commandLastSubmitted', new Date());
        self.transitionToRoute('database', {database_name: dbName});
      });
    }
  }
});

export default ApplicationController;
