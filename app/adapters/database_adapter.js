var RSVP = Ember.RSVP;

var DatabaseAdapter = DS.Adapter.extend({
  find: function(store, type, id) {
//typeKey

  },

  createRecord: function() {

  },

  deleteRecord: function() {

  },

  findAll: function(store, type) {
    return EIDB.getDatabaseNames().then(function(names) {
      var reqs = [];
      for (var i=0; i < names.length; i++) {
        reqs.push(EIDB.open(names[i]));
      }

      return RSVP.all(reqs);
    });
  }
});

export default DatabaseAdapter;
