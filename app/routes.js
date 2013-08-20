function Routes() {
  this.resource('databases', {path: '/'}, function() {
    this.route('new');
    this.route('delete', {path: 'databases/:name/delete'});
  });
}

export default Routes;
