import EIDB from 'appkit/lib/EasyIndexedDB';
import __ from 'appkit/lib/underunderscore';

var confirm = window.confirm,
    alert = window.alert,
    indexedDB = window.indexedDB;

var DatabasesIndexController = Ember.ArrayController.extend({
  needs: 'databases',
  browserListsDbs: null,

  getDatabaseNames: function() {
    if (this.get('browserListsDbs')) {
      var controller = this,
          arr = [],
          req = indexedDB.webkitGetDatabaseNames();

      req.onsuccess = function(evt) {
        var arr = __.DOMStringListToArray(evt.target.result, function(i, list) {
          return {id: list[i]};
        });
        controller.set('content', arr);
      };
      req.onerror = function(evt) {
        console.log(evt);
      };
    }
  },

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
        reqs.push(EIDB.delete(obj.id));
      });

      Ember.RSVP.all(reqs).then(function(x) {
        controller.getDatabaseNames();
      });      
    }
  }
});

export default DatabasesIndexController;
