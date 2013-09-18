import { _domStringListToArray } from 'appkit/helpers/utils';

var DatabaseSerializer = DS.JSONSerializer.extend({
  extractSingle: function(store, type, payload, id, requestType) {
    return this._super(store, type, payload, id, requestType);
  },

  extractArray: function(store, type, payload) {
    var dbs = payload.map(function(db) {
      db.id = db.name;
      db.objectStores = _domStringListToArray(db.objectStoreNames);
      return db;
    });
    return this._super(store, type, dbs);
  },

  // called after extractSingle/extractArray
  // normalize: function(type, hash, property) {
  //   return this._super(type, hash, property);
  // }
});

export default DatabaseSerializer;
