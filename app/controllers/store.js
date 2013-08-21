import EIDB from 'appkit/lib/EasyIndexedDB';

var StoreController = Ember.ArrayController.extend({
  dbName: null,
  storeName: null,
  isGithub: function() {
    return this.get('storeName') === 'ember_github_issues';
  }.property(),

  getData: function() {
    var controller = this,
        dbName = this.get('dbName'),
        storeName = this.get('storeName'),
        isGithub = this.get('isGithub');

    EIDB._open(dbName).then(function(db) {
      var data = [];

      db.objectStore(storeName)._idbObjectStore.openCursor().onsuccess = function(evt) {
        var cursor = evt.target.result;
        if (cursor) {
          var obj,
              d = cursor.value;
          
          if (isGithub) {
            obj = {avatarURL: d.user.avatar_url,
                   json: JSON.stringify(d, null, 4)};           
          } else {
            obj = {json: JSON.stringify(d, null, 4)};
          }  

          data.push(obj);
          cursor.continue();
        } else {
          controller.set('content', data);
        }
      };
    });
  }
});

export default StoreController;