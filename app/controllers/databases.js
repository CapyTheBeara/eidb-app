import EIDB from 'appkit/lib/EasyIndexedDB';

var DatabasesController = Ember.Controller.extend({
  dbNameInput: null,

  selectDb: function() {
    var controller = this,
        name = this.get('dbNameInput');
        
    EIDB._open(name).then(function(db) {
      controller.set('dbNameInput', null);
      controller.transitionToRoute('stores.index', name);
    });
  }
});

export default DatabasesController;
