import EIDB from 'appkit/lib/EasyIndexedDB';

// delete a database by visiting a route
var DatabasesDeleteRoute = Ember.Route.extend({
  redirect: function(params) {
    var controller = this;
    EIDB.delete(params.name).then(function() {
      controller.transitionTo('/');
    });
  }
});

export default DatabasesDeleteRoute;