var attr = DS.attr;

var ObjectStore = DS.Model.extend({
  name: attr(),
  keyPath: attr(),
  autoIncrement: attr(),
  database: DS.belongsTo('database'),
  records: DS.hasMany('record')
});

export default ObjectStore;
