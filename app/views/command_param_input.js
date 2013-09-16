var CommandInputField = Ember.TextField.extend({
  classNames: ['form-control'],
  value: Ember.computed.alias('parentView.value'),
  model: Ember.computed.alias('parentView.model'),
  placeholder: Ember.computed.alias('parentView.placeholder'),
});

/***************************************************/

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
