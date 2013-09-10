var StoreController = Ember.ObjectController.extend({
  needs: ['application', 'database'],

  storeName: null,
  db: Ember.computed.alias('controllers.database.content')
});

export default StoreController;
