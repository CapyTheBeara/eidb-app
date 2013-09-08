import { _eidbCommands } from 'appkit/helpers/utils';
import CommandForm from 'appkit/models/command_form';

var CommandFormComponent = Ember.Component.extend({
  model: CommandForm.create(),
  errors: Ember.computed.alias('model.errors'),

  commandList: function() {
    return _eidbCommands();
  }.property(),

  runCommand: function() {
    var req, params,
        resultMsg = "Command result:",
        component = this,
        model = this.get('model'),
        command = this.get('model.command');

    if (!this.get('commandList').contains(command)) {
      EIDB.trigger('error', {name: 'That is not a valid command'});
      return;
    }

    if (!model.get('isValid')) { return; }

    console.log('Executing command:', "EIDB." + command);

    if (EIDB[command] instanceof Function) {
      params = this.get('model.attributeValues');
console.log(params);
      req = EIDB[command].apply(null, params);

      if (typeof(req) === "object" && 'then' in req) {
        req.then(function(res) {
          component.sendAction('commandResulted');
          console.log(resultMsg, res);
        });
      } else {
        console.log(resultMsg, req);
      }
    } else {
      console.log(resultMsg, EIDB[command]);
    }

    this.set('model.command', null);
    this.set('model', CommandForm.create());
  },

  actions: {
    submitCommand: function(evt) {
      this.sendAction();
      this.runCommand();
    }
  }
});

export default CommandFormComponent;
