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
