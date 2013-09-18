var attr = DS.attr;

var Database = DS.Model.extend({
  name: attr(),
  version: attr(),
  objectStoreNames: attr(),
  objectStores: DS.hasMany('object_store', {async: true})
});

export default Database;
