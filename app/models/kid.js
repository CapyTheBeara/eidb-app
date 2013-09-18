var attr = DS.attr;

var Kid = DS.Model.extend({
  _key: attr(),
  name: attr(),
  color: attr(),
  age: attr()
});

Kid.reopenClass({
  dbName: 'eidb',
  storeName: 'kids',
  idAttr: '_key'
});

export default Kid;
