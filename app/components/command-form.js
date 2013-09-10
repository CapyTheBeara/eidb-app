import { _eidbCommands } from 'appkit/helpers/utils';
import CommandForm from 'appkit/models/command_form';

var CommandFormComponent = Ember.Component.extend({
  model: null,
  errors: Ember.computed.alias('model.errors'),
  modelResult: null,
  result: null,

  init: function() {
    this._super();
    this.createModel();
  },

  createModel: function() {
    var dbName = this.get('currentDbName'),
        storeName = this.get('currentStoreName'),
        form = CommandForm.create({
          currentDbName: dbName,
          currentStoreName: storeName
        });

    this.set('model', form);
  },

  resultChanged: function() {
    var res = this.get('modelResult');
    if (!res) { return; }

    this.set('result', JSON.stringify(res, null, 4));
  }.observes('modelResult'),

  commandList: function() {
    return _eidbCommands();
  }.property(),

  runCommand: function() {
    var self = this,
        model = this.get('model'),
        command = this.get('model.command');

    this.set('result', null);

    if (!this.get('commandList').contains(command)) {
      EIDB.trigger('error', {name: 'That is not a valid command'});
      return;
    }

    if (!model.get('isValid')) { return; }

    console.log('Executing command:', "EIDB." + command);
    this.sendAction();

    model.run().then(function(res) {
      self.createModel();

      self.set('modelResult', res);
      self.sendAction('commandResulted');
    });
  },

  actions: {
    submitCommand: function(evt) {
      this.sendAction();
      this.runCommand();
    },

    hideResult: function() {
      $('#command-result').hide();
    }
  }
});

export default CommandFormComponent;
