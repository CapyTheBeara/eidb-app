import Resolver from 'resolver';
import formatJSON from 'appkit/helpers/formatJSON';

import DatabaseAdapter from 'appkit/adapters/database_adapter';
import ObjectStoreAdapter from 'appkit/adapters/object_store_adapter';
import RecordAdapter from 'appkit/adapters/record_adapter';

import DatabaseSerializer from 'appkit/adapters/serializers/database_serializer';
import ObjectStoreSerializer from 'appkit/adapters/serializers/object_store_serializer';

import routes from 'appkit/routes';

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit',
  Resolver: Resolver,

  DatabaseAdapter: DatabaseAdapter,
  ObjectStoreAdapter: ObjectStoreAdapter,
  RecordAdapter: RecordAdapter,

  DatabaseSerializer: DatabaseSerializer,
  ObjectStoreSerializer: ObjectStoreSerializer
});

App.Router.map(routes);

export default App;

Ember.RSVP.configure('onerror', function(error) {
  console.log('RSVP onerror', error, error.message + '', error.stack);
});
