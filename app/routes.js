function Routes() {
  this.resource('databases', {path: '/'}, function() {
    this.route('delete', {path: 'databases/:database_id/delete'});
  });

  this.resource('stores', {path: '/databases/:database_id'}, function() {
    this.resource('store', {path: ':store_id'});
  });
}

export default Routes;
