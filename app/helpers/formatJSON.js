Ember.Handlebars.helper('formatJSON', function(value, options) {
  var _val = JSON.stringify(value, null, 4);
  return new Ember.Handlebars.SafeString('<code>' + _val + '</code>');
});

export default {};
