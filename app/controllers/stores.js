import EIDB from 'appkit/lib/EasyIndexedDB';
import __ from 'appkit/lib/underunderscore';

var confirm = window.confirm,
    alert = window.alert;

var StoresController = Ember.ArrayController.extend({
  selectedDb: null,
  storeNameInput: null,

  getStoreNames: function() {
    var controller = this,
        dbName = this.get('selectedDb');

    // TODO - fix EIDB.open
    EIDB._open(dbName).then(function(db) {
      var names = db.objectStoreNames;
      var arr = __.DOMStringListToArray(names, function(i, list) {
        return {id: list[i]};
      });

      controller.set('content', arr);
    });
  },

  createStore: function() {
    var controller = this,
        dbName = this.get('selectedDb'),
        name = this.get('storeNameInput'),
        content = this.get('content');

    if (content.findProperty('id', name)) {
      alert('That name already exists. Please use another.');
    } else {
      // TODO - fix EIDB.open
      // TODO - implement EIDB.version(database)
      // TODO - implement EIDB.createObjectStore(db, objectStore)
      EIDB._open(dbName).then(function(db){
        var version = db.version + 1;

        EIDB._open(dbName, version, function(resp) {
          resp.db.createObjectStore(name);

        }).then(function(db) {
          controller.set('storeNameInput', null);
          controller.getStoreNames();
        });
      });
    }
  },

  deleteStore: function(name) {
    var controller = this,
        dbName = this.get('selectedDb');

    if (confirm('Are you sure?')) {
      EIDB._open(dbName).then(function(db){
        var version = db.version + 1;

        EIDB._open(dbName, version, function(resp) {
          resp.db.deleteObjectStore(name);
          controller.getStoreNames();
        });
      });
    }
  },

  deleteAllStores: function() {
    var controller = this,
        dbName = this.get('selectedDb'),
        content = this.get('content');

    if (confirm('Are you sure?')) {
      EIDB._open(dbName).then(function(db) {
        var version = db.version + 1;

        EIDB._open(dbName, version, function(resp) {
          content.forEach(function(obj) {
            resp.db.deleteObjectStore(obj.id);
          });

          controller.getStoreNames();
        });
      });   
    }
  }
});

export default StoresController;
