var CommandInputField = Ember.TextField.extend({
  classNames: ['form-control'],
  value: null,
  model: Ember.computed.alias('parentView.model'),
  placeholder: Ember.computed.alias('parentView.placeholder'),

  setModelAttribute: function() {
    var param = this.get('placeholder'),
        value = this.get('value');

    this.set("model." + param + ".value", value);
  }.observes('value')
});

var CommandParamInput = Ember.ContainerView.extend({
  classNameBindings: ['isValid:has-success:has-error'],
  childViews: [CommandInputField],
  model: null,

  isValid: function() {
    this.get('childViews');  // need this for some reason to update class name
    return this.get('model.' + this.get('placeholder') + ".isValid");
  }.property('childViews.0.value')

});

export default CommandParamInput;
