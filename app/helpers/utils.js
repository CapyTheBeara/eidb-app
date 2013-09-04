function _domStringListToArray(list) {
  var arr = [];
  for (var i = 0; i < list.length; i++) { arr[i] = list[i]; }
  return arr;
}

function _eidbGetTree(callback) {
  EIDB.webkitGetDatabaseNames().then(function(names) {
    names = _domStringListToArray(names);

    var reqs = names.map(function(name) {
      return EIDB.open(name).then(function(db) {
        var storeNames = _domStringListToArray(db.objectStoreNames)
                              .map(function(name) { return {name: name}; });
        return {
          name: db.name,
          version: db.version,
          stores: storeNames
        };
      });
    });

    Ember.RSVP.all(reqs).then(function(res) {
      callback(res);
    });
  });
}

function _eidbGetObjectStores(dbName, callback) {
  var stores = [];

  return EIDB.open(dbName).then(function(db) {
    var names = _domStringListToArray(db.objectStoreNames);

    stores = names.map(function(name) {
      return db.objectStore(name);
    });

    callback(stores);
  });
}

function _eidbDeleteAllDbs(callback) {
  EIDB.webkitGetDatabaseNames().then(function(names) {
    names = _domStringListToArray(names);

    var reqs = names.map(function(name) {
      EIDB.delete(name);
    });

    Ember.RSVP.all(reqs).then(function() {
      callback();
    });
  });
}

export { _domStringListToArray, _eidbGetTree, _eidbGetObjectStores, _eidbDeleteAllDbs };
