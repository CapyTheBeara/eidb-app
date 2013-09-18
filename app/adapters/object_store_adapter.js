import { _domStringListToArray } from 'appkit/helpers/utils';

var ObjectStoreAdapter = DS.Adapter.extend({
  find: function(store, type, id) {
    var ostore,
        names = id.split('.'),
        dbName = names[0],
        storeName = names[1];

    return EIDB.open(dbName).then(function(db) {
      ostore = db.objectStore(storeName);
      return ostore.getAll();
    }).then(function(records) {
      return { store: ostore, records: records };
    });

  },

  findMany: function(store, type, ids, owner) {
    var dbName = owner.get('name');

    return EIDB.open(dbName).then(function(db) {
      return ids.map(function(storeName, i) {
        return db.objectStore(storeName);
      });
    });
  }
});

export default ObjectStoreAdapter;
