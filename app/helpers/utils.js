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
                              .map(function(name) {
                                return {name: name};
                              });
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

export { _domStringListToArray, _eidbGetTree };
