var CommandFormComponent = Ember.Component.extend({
  eidbCommand: null,

  commandList: function() {
    var commands = [];
    for (var prop in EIDB) {
      if (EIDB.hasOwnProperty(prop) && prop[0] !== prop[0].toUpperCase()) {
        commands.push(prop);
      }
    }
    return commands.sort();
  }.property(),

  runCommand: function() {
    var req,
        controller = this,
        command = this.get('eidbCommand');

    command = "EIDB." + command;
    console.log('Executing command:', command);

    try {
      req = eval(command).then(function(res) {
        console.log("Command result:", res);

        controller.sendAction();
      });
    } catch (e) {
      console.log(eval(command));
      controller.sendAction();
    }

    this.set('eidbCommand', null);
  },

  actions: {
    submitCommand: function() {
      this.runCommand();
    },

    setCommand: function(command) {
      this.set('eidbCommand', command);
      $('#command-input').focus();
    },

    showCommandList: function() {
      this.set('commandListVisible', true);
    }
  }
});

export default CommandFormComponent;
