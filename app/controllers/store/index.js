function _numberify(val) {
  var num = Number(val);
  if (!isNaN(num)) { return num; }
  return val;
}

var StoreIndexController = Ember.ArrayController.extend({
  needs: ['application', 'store'],
  db: Ember.computed.alias('controllers.store.db'),
  storeName: Ember.computed.alias('controllers.store.storeName'),
  searchAttr: null,
  eqValue: null,
  matchValue: null,

  init: function() {
    this._super();
    this.setRecords();
    this.setRecordAttributes();
  },

  setRecords: function() {
    var controller = this,
        db = this.get('db'),
        storeName = this.get('storeName');

    if (storeName) {
      EIDB.getAll(db.name, storeName).then(function(res) {
        controller.set('content', res);;
      });
    }
  }.observes('controllers.application.commandLastSubmitted'),

  setRecordAttributes: function() {
    var controller = this,
        db = this.get('db'),
        storeName = this.get('storeName');

    EIDB.find(db.name, storeName).first().then(function(record) {
      var attrs = Object.keys(record).sort();
      controller.set('recordAttributes', attrs);
      controller.set('searchAttr', attrs[0]);
    });
  },

  filterResults: function() {
    var regex, val,
        controller = this,
        db = this.get('db'),
        storeName = this.get('storeName'),
        searchAttr = this.get('searchAttr'),
        eqValue = this.get('eqValue'),
        matchValue = this.get('matchValue'),
        query = EIDB.find(db.name, storeName);

    if (eqValue) {
      val = _numberify(eqValue);
      query = query.eq(searchAttr, val);

    } else if (matchValue) {
      val = _numberify(matchValue);
      regex = new RegExp(val);
      query = query.match(searchAttr, regex);
    }

    query.run().then(function(res) {
      controller.set('content', res);
    });

  }.observes('eqValue', 'matchValue'),

  actions: {
    editRecord: function(record) {
      // record.set('isEditing', true);
    },

    deleteRecord: function(record) {
      var self = this,
          db = this.get('db'),
          storeName = this.get('storeName');

      if (confirm("Are you sure?")) {
        EIDB.deleteRecord(db.name, storeName, record._key).then(function() {
          self.removeObject(record);
        });
      }
    }
  }
});

export default StoreIndexController;
