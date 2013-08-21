var indexedDB = window.indexedDB;

var DatabasesIndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    var supports = 'webkitGetDatabaseNames' in indexedDB;
    controller.set('browserListsDbs', supports);
    controller.getDatabaseNames();
  }
});

export default DatabasesIndexRoute;
