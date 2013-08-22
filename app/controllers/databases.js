import EIDB from 'appkit/lib/EasyIndexedDB';

var DatabasesController = Ember.Controller.extend({
  dbNameInput: null,

  selectDb: function() {
    var controller = this,
        dbName = this.get('dbNameInput');
        
    EIDB._open(dbName).then(function(db) {
      controller.set('dbNameInput', null);
      controller.transitionToRoute('stores.index', dbName);
    });
  },

  populateDb: function() {
    var controller = this,
        dbName = 'example_' + (new Date()).getTime(),
        storeName = 'ember_github_issues';

    Ember.RSVP.all(
      [$.get("https://api.github.com/repos/emberjs/ember.js/issues?>page=1?&per_page=100"),
       $.get("https://api.github.com/repos/emberjs/ember.js/issues?>page=2?&per_page=100")]
    ).then(function(res){
      var issues = [].concat.apply([], res);

      EIDB._open(dbName, null, function(res) {
        var db = res.db;
        db.createObjectStore(storeName, {keyPath: 'id'});

      }, true).then(function(db) {
        issues.forEach(function(issue, i) {
          db.add(storeName, i, issue);
        });

        return db;
      }).then(function(db) {
        db.close();
        controller.transitionToRoute('store', dbName, storeName);
      });
    });
  }
});

export default DatabasesController;
