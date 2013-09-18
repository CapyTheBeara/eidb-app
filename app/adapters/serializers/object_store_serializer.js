var ObjectStoreSerializer = DS.RESTSerializer.extend({
  extractSingle: function(store, type, payload, id, requestType) {
    var storePayload,
        ostore = payload.store,
        _records = payload.records;

    ostore.id = ostore.name;
    ostore.records = _records.mapProperty('_key');
    storePayload = { object_store: ostore, records: _records };

    return this._super(store, type, storePayload, id, requestType);
  },

  extractArray: function(store, type, payload) {
    var stores = payload.map(function(_store) {
      _store.id = _store.name;
      return _store;
    });
    return this._super(store, type, stores);
  },

  normalizeHash: {
    records: function(hash) {
      hash.id = hash._key;
      return hash;
    }
  }
});

export default ObjectStoreSerializer;
