import { _eidbGetObjectStores } from 'appkit/helpers/utils';

var DatabaseIndexController = Ember.ArrayController.extend({
  needs: ['application', 'database'],
  db: Ember.computed.alias('controllers.database.content'),

  init: function() {
    this._super();
    this.setStores();
  },

  setStores: function() {
    var db = this.get('db'),
        controller = this;

    _eidbGetObjectStores(db.name, function(stores) {
      controller.set('stores', stores);
    });
  }.observes('db', 'controllers.application.commandLastSubmitted'),

  deleteDatabase: function() {
    if (window.confirm('Are you sure?')) {
      var dbName = this.get('controllers.application.currentDbName');
      EIDB.delete(dbName);

      this.set('controllers.application.currentDbName', null);
      this.transitionToRoute('index');
    }
  }

});

export default DatabaseIndexController;
