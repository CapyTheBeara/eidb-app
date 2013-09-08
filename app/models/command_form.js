import CommandAttribute from 'appkit/models/command_attribute';

var CommandForm = Ember.Object.extend({
  command: null,
  userMessages: null,
  attributes: [],

  setAttributes: function() {
    this.set('attributes', []);

    var attr,
        params = this.get('params'),
        attrs = this.get('attributes');

    params.forEach(function(param) {
      attr = CommandAttribute.create({name: param, form: this});
      this.set(param, attr);
      attrs.pushObject(attr);
    }, this);

  }.observes('command'),

  params: function() {
    var fstr, paramMatch, match,
        str = "EIDB." + this.get('command'),
        func = eval(str);    /*****  eval  *****/

    if (func) {
      fstr = func.toString();
      paramMatch = fstr.match(/\((.*)\)/);

      if (paramMatch) {
        match = paramMatch[1];
        if (match === '') { return []; }
        return match.split(',');
      }
      return [];
    }
    return [];
  }.property('command'),

  attributeValues: function() {
    return this.get('attributes').getEach('value').compact();
  }.property(),

  errors: function() {
    return this.get('attributes').getEach('error').compact();
  }.property('attributes.@each.error'),

  isValid: function() {
    if (this.get('errors').length === 0) { return true; }
    return false;
  }.property()
});

export default CommandForm;
