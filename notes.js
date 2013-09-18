/* for reference, this is how to send arrrow keyboard events */

Ember.TextSupport.KEY_EVENTS = {
  13: 'insertNewline',
  27: 'cancel',
  38: 'arrowUp',
  40: 'arrowDown'
};

var ArrowKeysField = Ember.TextField.extend({
  arrowUp: function(evt) {
    this.sendAction('on-up', evt);
  },

  arrowDown: function(evt) {
    this.sendAction('on-down', 'down');
  }
});

export default CommandTextField;

/* The view wold have: */

{{view 'arrow_keys_field'
                 on-up = "component function"
                 on-down = "controller function"}}




/* http://eduardmoldovan.com/technical/ember-custom-events/ */
/* perhaps this is better: http://emberjs.com/api/classes/Ember.Application.html */
App = Ember.Application.create({
  customEvents: {
    // add support for the loadedmetadata media
    // player event
    'loadedmetadata': "loadedMetadata"
  }
});

//============================================
//* Testing EIDBRecordAdapter
var store = this.get('store');
var id;
var kid = store.createRecord('kid', {name: 'bob'});

kid.set('name', 'BOBO');

kid.save().then(function(kid) {
  id = kid.get('id');
  console.log('kid created ~~~~>');
  kid.deleteRecord();
  return kid.save();
}).then(function() {
  return store.find('kid', id);
}).then(null, function(err) {
  console.log('CRUD record complete~~~~>');
});

store.findAll('kid').then(function(res) {
  console.log('findAll----->', res.get('content.length'));
});

store.findQuery('kid', {name: 'Stan', color: 'red'}).then(function(res) {
  console.log('findQuery======', res.get('content.length'));
});
