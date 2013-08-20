import EIDB from 'appkit/lib/EasyIndexedDB';

var indexedDB = window.indexedDB;

var DatabasesIndexController = Ember.ArrayController.extend({
  needs: 'databases',
  browserListsDbs: null,
  selectedDb: null,
  selectedDbBinding: 'controllers.databases.selectedDb',

  getDatabaseNames: function() {
    if (this.get('browserListsDbs')) {
      var controller = this,
          arr = [],
          req = indexedDB.webkitGetDatabaseNames();

      req.onsuccess = function(evt) {
        var list = evt.target.result;
        delete list.length;
        for (var i in list) { arr[i] = {name: list[i]};}
        controller.set('content', arr);
      };
      req.onerror = function(evt) {
        console.log(evt);
      };
    }
  }.observes('selectedDb'),

  deleteDb: function(name) {
    var controller = this;
    if (confirm('Are you sure?')) {
      EIDB.delete(name).then(function(){
        controller.getDatabaseNames();
      });
    }
  },

  deleteAllDbs: function() {
    if (confirm('Are you sure?')) {
      var controller = this,
          names = this.get('content'),
          reqs = [];

      names.forEach(function(obj) {
        reqs.push(EIDB.delete(obj.name));
      });

      Ember.RSVP.all(reqs).then(function(x) {
        controller.getDatabaseNames();
      });      
    }
  }
});

export default DatabasesIndexController;
