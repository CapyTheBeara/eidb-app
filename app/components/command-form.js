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

    if (command.length === 0) { return false; }

    command = "EIDB." + command;
    console.log('Executing command:', command);

    try {
      req = eval(command).then(function(res) {
        console.log("Command result:", res);
      });

      this.sendAction();
    } catch (e) {
      EIDB.trigger('error', e);
    }

    this.set('eidbCommand', null);
  },

  actions: {
    submitCommand: function() {
      this.runCommand();
    },

    setCommand: function(command) {
      var dbName = this.get('currentDbName'),
          storeName = this.get('currentStoreName'),
          isStoreCommand = command.match(/Record/);

      $('#command-input').focus();
      if (dbName) {
        command = command + "('" + dbName + "'";
      }

      if (storeName && isStoreCommand) {
        command = command + ", '" + storeName + "'";
      }
      this.set('eidbCommand', command);
    },

    showCommandList: function() {
      this.set('commandListVisible', true);
    }
  }
});

export default CommandFormComponent;
