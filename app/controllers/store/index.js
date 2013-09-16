var StoreIndexController = Ember.ArrayController.extend({
  needs: ['application', 'store'],
  db: Ember.computed.alias('controllers.store.db'),
  storeName: Ember.computed.alias('controllers.store.storeName'),

  init: function() {
    this._super();
    this.setRecords();
  },

  setRecords: function() {
    var controller = this,
        db = this.get('db'),
        storeName = this.get('storeName');

    if (storeName) {
      EIDB.getAll(db.name, storeName).then(function(_content) {
        var content = _content.map(function(val) {
          return JSON.stringify(val, null, 4);
        });
        controller.set('content', content);
      });
    }
  }.observes('controllers.application.commandLastSubmitted'),

});

export default StoreIndexController;
