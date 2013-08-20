import EIDB from 'appkit/lib/EasyIndexedDB';

var DatabasesController = Ember.Controller.extend({
  dbNameInput: null,
  selectedDb: null,

  selectDb: function() {
    var controller = this,
        name = this.get('dbNameInput');
        
    EIDB.open(name).then(function(db) {
      controller.set('selectedDb', name);
      controller.set('dbNameInput', null);
      db.close();
    });
  }
});

export default DatabasesController;
