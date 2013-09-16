var CommandAttribute = Ember.Object.extend({
  name: "",
  form: null,
  value: null,
  _value: null,
  error: null,

  _valueDidChange: function() {
    this.set('_value', this.get('value'));
  }.observes('value'),

  isValid: function() {
    var value = this.get("value");
    if (value === null) { return true; }

    this.set('error', null);
    if (value.match(/{/)) { this.validateObj(value); }
    if (this.get('error')) { return false; }
    return true;
  }.property('value'),

  validateObj: function (value) {
    var name = this.get('name');

    if (value.match(/}/)) {
      try {
        value = eval("(" + value + ")");    /***** eval ******/
        this.set('_value', value);
        return true;
      } catch (e) {
        var error = {name: name + " syntax error", error: e, message: e.message};
        this.set("error", error);
        return false;
      }
    }
    return false;
  }
});

export default CommandAttribute;
