var ApplicationView = Ember.View.extend({
  click: function(evt) {
    if ($('#command-form-li').has(evt.target).length < 1) {
      this.get('controller').send('hideCommandList');
    }
  }
});

export default ApplicationView;
