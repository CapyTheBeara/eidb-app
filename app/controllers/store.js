import EIDB from 'appkit/lib/EasyIndexedDB';

var StoreController = Ember.ArrayController.extend({
  dbName: null,
  storeName: null,
  search: null,

  isGithub: function() {
    return this.get('storeName') === 'ember_github_issues';
  }.property('storeName'),

  getData: function() {
    var controller = this,
        dbName = this.get('dbName'),
        storeName = this.get('storeName'),
        search = this.get('search'),
        isGithub = this.get('isGithub'),
        createGithubObj = function(d) {
          return {avatarURL: d.user.avatar_url,
                  title: d.title,
                  json: JSON.stringify(d, null, 4)};
        };

    if (isGithub && search && search.length > 0) {
      search = parseInt(search, 10);
      EIDB.find(dbName, storeName, {"comments": search}).then(function(res) {
        var data = [];
        res.forEach(function(json) {
          data.push(createGithubObj(json));
        });
        controller.set('content', data);
      });
    } else if (search === null || search.length === 0) {
      EIDB._open(dbName).then(function(db) {
        var data = [];

        db.objectStore(storeName)._idbObjectStore.openCursor().onsuccess = function(evt) {
          var cursor = evt.target.result;
          if (cursor) {
            var obj,
                d = cursor.value;

            if (isGithub) {
              obj = createGithubObj(d);
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
  }.observes('search')
});

export default StoreController;
