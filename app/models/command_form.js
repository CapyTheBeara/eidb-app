import CommandAttribute from 'appkit/models/command_attribute';

var CommandForm = Ember.Object.extend({
  command: null,
  currentDbName: null,
  currentStoreName: null,
  userMessages: null,
  attributes: [],

  setAttributes: function() {
    this.set('attributes', []);

    var attr,
        value = null,
        params = this.get('params'),
        attrs = this.get('attributes'),
        dbName = this.get('currentDbName'),
        storeName = this.get('currentStoreName'),
        command = this.get('command');

    params.forEach(function(param) {
      if (param === 'dbName') { value = dbName; }
      if (param === 'storeName' && command !== 'createObjectStore') {
        value = storeName;
      }

      attr = CommandAttribute.create({
        name: param,
        form: this
      });
      attr.set('value', value);

      value = null;
      this.set(param, attr);
      attrs.pushObject(attr);

    }, this);

    this.set('attributes', attrs);

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
        return match.replace(/\s/g, '').split(',');
      }
      return [];
    }
    return [];
  }.property('command'),

  attributeValues: function() {
    return this.get('attributes').getEach('_value').compact();
  }.property(),

  errors: function() {
    return this.get('attributes').getEach('error').compact();
  }.property('attributes.@each.error'),

  isValid: function() {
    if (this.get('errors').length === 0) { return true; }
    return false;
  }.property(),

  run: function() {
    var req,
        command = this.get('command'),
        attrVals = this.get('attributeValues');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (EIDB[command] instanceof Function) {
        req = EIDB[command].apply(null, attrVals);

        if (typeof(req) === "object" && 'then' in req) {
          return resolve(req.then(function(res) { return res; }));
        }
        return resolve(req);

      }
      return resolve(EIDB[command]);

    });
  }
});

export default CommandForm;
