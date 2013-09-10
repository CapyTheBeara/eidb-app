function Routes() {
  this.resource('mockup');

  this.resource('database', {path: 'database/:database_name'}, function() {
    this.resource('store', {path: 'store/:store_name'}, function() {
      // this.route('index');
    });
  });
}

export default Routes;
