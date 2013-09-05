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
  }.observes('controllers.application.commandLastSubmitted')

});

export default DatabaseIndexController;
