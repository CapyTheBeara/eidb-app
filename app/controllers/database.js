import { _eidbGetObjectStores } from 'appkit/helpers/utils';

var DatabaseController = Ember.ObjectController.extend({
  needs: ['application'],
  stores: [],

  setStores: function() {
    var db = this.get('content'),
        controller = this;

    _eidbGetObjectStores(db.name, function(stores) {
      controller.set('stores', stores);
    });
  }.observes('controllers.application.commandLastSubmitted')
});

export default DatabaseController;
