// monocle/dev branch 9/4/13

(function(globals) {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();

define("eidb/database",
  ["eidb/indexed_db","eidb/object_store","eidb/transaction","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var idbDatabase = __dependency1__.idbDatabase;
    var ObjectStore = __dependency2__.ObjectStore;
    var Transaction = __dependency3__.Transaction;

    var Database = function(idbDatabase) {
      this._idbDatabase = idbDatabase;
      this.name = idbDatabase.name;
      this.version = idbDatabase.version;
      this.objectStoreNames = idbDatabase.objectStoreNames;
    };

    Database.prototype = {
      _idbDatabase: null,
      name: null,
      version: null,
      objectStoreNames: null,

      close: function() {
        return this._idbDatabase.close();
      },

      createObjectStore: function(name, options) {
        return new ObjectStore(this._idbDatabase.createObjectStore(name, options));
      },

      deleteObjectStore: function(name) {
        return this._idbDatabase.deleteObjectStore(name);
      },

      objectStore: function(name) {
        return this.transactionFor(name).objectStore(name);
      },

      transaction: function(objectStores, mode) {
        var tx;

        if (mode !== undefined) {
          tx = this._idbDatabase.transaction(objectStores, mode);
        } else {
          tx = this._idbDatabase.transaction(objectStores);
        }

        return new Transaction(tx);
      },

      _transactionsMap: null,

      transactionFor: function(objectStore) {
        var self = this;
        if (!this._transactionsMap) { this._transactionsMap = {}; }

        // Clear transaction references at the end of the browser event loop
        // TODO: Is this sane?
        setTimeout(function() {
          self._transactionsMap = {};
        }, 0);

        return this._transactionsMap[objectStore] = this._transactionsMap[objectStore] || this.transaction([objectStore], "readwrite");
      },

      add: function(objectStore, id, obj) {
        var store = this.objectStore(objectStore),
            key = store.keyPath;

        obj[key] = id;
        return store.add(obj).then(function(event) {
          return obj;
        });
      },

      get: function(objectStore, id) {
        var store = this.objectStore(objectStore);
        return store.get(id);
      },

      put: function(objectStore, id, obj) {
        var store = this.objectStore(objectStore),
            key = store.keyPath;

        obj[key] = id;
        return store.put(obj);
      },

      "delete": function(objectStore, id) {
        return this.objectStore(objectStore).delete(id);
      }
    };


    __exports__.Database = Database;
  });
define("eidb/eidb",
  ["eidb/indexed_db","eidb/promise","eidb/database","eidb/utils","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var indexedDB = __dependency1__.indexedDB;
    var Promise = __dependency2__.Promise;
    var RSVP = __dependency2__.RSVP;
    var Database = __dependency3__.Database;
    var _request = __dependency4__._request;
    var __instrument__ = __dependency4__.__instrument__;

    function open(name, version, upgradeCallback, opts) {
      return new Promise(function(resolve, reject) {
        var req = version ? indexedDB.open(name, version) : indexedDB.open(name);

        req.onsuccess = function(event) {
          var db = new Database(req.result);
          resolve(db);

          if (!opts || (opts && !opts.keepOpen)) {
            setTimeout(function() {
              db.close();
            }, 0);
          }
        };
        req.onerror = function(event) {
          reject(event);
        };
        req.onupgradeneeded = function(event) {
          var db = new Database(req.result),
              ret = (opts && opts.returnEvent) ? {db: db, event: event} : db;
          if (upgradeCallback) { upgradeCallback(ret); }
        };
      });
    }

    function _delete(name) {
      return _request(indexedDB, "deleteDatabase", arguments);
    }

    function version(dbName){
      return open(dbName).then(function(db) {
        return db.version;
      });
    }

    function webkitGetDatabaseNames() {
      return _request(indexedDB, "webkitGetDatabaseNames");
    }

    function bumpVersion(dbName, upgradeCallback, opts) {
      return open(dbName).then(function(db) {
        return open(dbName, db.version + 1, function(res) {
          if (upgradeCallback) { upgradeCallback(res); }
        }, opts);
      });
    }

    function createObjectStore(dbName, storeName, storeOpts) {
      var opts = storeOpts ? storeOpts : {autoIncrement: true};

      return bumpVersion(dbName, function(db) {
        db.createObjectStore(storeName, opts);
      });
    }

    function deleteObjectStore(dbName, storeName) {
      return bumpVersion(dbName, function(db) {
        db.deleteObjectStore(storeName);
      });
    }

    function createIndex(dbName, storeName, indexName, keyPath, indexOpts) {
      return bumpVersion(dbName, function(res) {
        var store = res.event.target.transaction.objectStore(storeName);
        store.createIndex(indexName, keyPath, indexOpts);
      }, {returnEvent: true});
    }

    function _storeAction(dbName, storeName, callback, openOpts) {
      return open(dbName, null, null, openOpts).then(function(db) {
        var store = db.objectStore(storeName);

        if (openOpts && openOpts.keepOpen) {
          return callback(store, db);
        }

        return callback(store);
      });
    }

    // note ObjectStore#insertWith_key will close the database
    function _insertRecord(dbName, storeName, value, key, method) {
      return _storeAction(dbName, storeName, function(store, db) {

        if (value instanceof Array) {
          return RSVP.all(value.map(function(_value, i) {

            if (!store.keyPath && key instanceof Array) {
              return store.insertWith_key(method, _value, key[i], db);
            }

            if (!store.keyPath) {
              return store.insertWith_key(method, _value, null, db);
            }

            // in-line keys
            db.close();
            return store[method](_value);
          }));
        }

        if (!store.keyPath) {
          return store.insertWith_key(method, value, key, db);
        }

        // in-line keys
        db.close();
        return store[method](value, key);
      }, {keepOpen: true});
    }

    function addRecord(dbName, storeName, value, key) {
      return _insertRecord(dbName, storeName, value, key, 'add');
    }

    function putRecord(dbName, storeName, value, key) {
      return _insertRecord(dbName, storeName, value, key, 'put');
    }

    function getRecord(dbName, storeName, key) {
      return _storeAction(dbName, storeName, function(store) {
        return store.get(key);
      });
    }

    function deleteRecord(dbName, storeName, key) {
      return _storeAction(dbName, storeName, function(store) {
        return store.delete(key);
      });
    }

    function getAll(dbName, storeName, range, direction) {
      return _storeAction(dbName, storeName, function(store) {
        return store.getAll(range, direction);
      });
    }


    __exports__.open = open;
    __exports__._delete = _delete;
    __exports__.version = version;
    __exports__.webkitGetDatabaseNames = webkitGetDatabaseNames;
    __exports__.bumpVersion = bumpVersion;
    __exports__.createObjectStore = createObjectStore;
    __exports__.deleteObjectStore = deleteObjectStore;
    __exports__.createIndex = createIndex;
    __exports__.addRecord = addRecord;
    __exports__.getRecord = getRecord;
    __exports__.putRecord = putRecord;
    __exports__.deleteRecord = deleteRecord;
    __exports__.getAll = getAll;
  });
define("eidb/index",
  ["eidb/promise","eidb/utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;
    var _request = __dependency2__._request;
    var _openCursor = __dependency2__._openCursor;
    var _getAll = __dependency2__._getAll;

    var Index = function(idbIndex, store) {
      this._idbIndex = idbIndex;
      this.name = idbIndex.name;
      this.objectStore = store;
      this.keyPath = idbIndex.keyPath;
      this.multiEntry = idbIndex.multiEntry;
      this.unique = idbIndex.unique;
    };

    Index.prototype = {
      _idbIndex: null,
      name: null,
      objectStore: null,
      keyPath: null,
      multiEntry: null,
      unique: null,

      openCursor: function(range, direction, onsuccess) {
        return _openCursor(this._idbIndex, range, direction, onsuccess);
      },

      openKeyCursor: function(range, direction, onsuccess) {
        return _openCursor(this._idbIndex, range, direction, onsuccess, {keyOnly: true});
      },

      get: function(key) {
        return _request(this._idbIndex, "get", arguments);
      },

      getKey: function(key) {
        return _request(this._idbIndex, "getKey", arguments);
      },

      count: function(key) {
        return _request(this._idbIndex, "count", arguments);
      },

      getAll: function(range, direction) {
        return _getAll(this._idbIndex, range, direction);
      }
    };


    __exports__.Index = Index;
  });
define("eidb/indexed_db",
  ["exports"],
  function(__exports__) {
    "use strict";
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;


    __exports__.indexedDB = indexedDB;
  });
define("eidb/object_store",
  ["eidb/promise","eidb/index","eidb/utils","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;
    var Index = __dependency2__.Index;
    var __instrument__ = __dependency3__.__instrument__;
    var _request = __dependency3__._request;
    var _openCursor = __dependency3__._openCursor;
    var _getAll = __dependency3__._getAll;

    var ObjectStore = function(idbObjectStore) {
      this._idbObjectStore = idbObjectStore;
      this.keyPath = idbObjectStore.keyPath;
      this.indexNames = idbObjectStore.indexNames;
      this.name = idbObjectStore.name;
      this.autoIncrement = idbObjectStore.autoIncrement;
    };

    ObjectStore.prototype = {
      _idbObjectStore: null,
      keyPath: null,
      name: null,
      autoIncrement: null,

      add: function(value, key) {
       return _request(this._idbObjectStore, 'add', arguments);
      },

      get: function(key) {
        return _request(this._idbObjectStore, 'get', arguments);
      },

      put: function(value, key) {
        return _request(this._idbObjectStore, 'put', arguments);
      },

      "delete": function(key) {
        return _request(this._idbObjectStore, 'delete', arguments);
      },

      count: function() {
        return _request(this._idbObjectStore, 'count');
      },

      clear: function() {
        return _request(this._idbObjectStore, 'clear');
      },

      openCursor: function(range, direction, onsuccess) {
        return _openCursor(this._idbObjectStore, range, direction, onsuccess);
      },

      getAll: function(range, direction) {
        return _getAll(this._idbObjectStore, range, direction);
      },

      // For use with out-of-line key stores. (Database doesn't
      // return the interal key when fetching records.)
      // Requires a database that has not been closed.
      insertWith_key: function(method, value, key, db) {
        var store = this;

        if (key) {
          value._key = key;
          db.close();
          return store[method](value, key);
        }

        return store.add(value).then(function(key) {
          value._key = key;

          return __instrument__(function() {  // __instrument__ is used in testing
            // if the transaction used for #add above gets put into the next
            // event loop cycle (happens when using Ember), we need to create
            // a new transaction fo the #put action
            var tx = store._idbObjectStore.transaction.db.transaction(store.name, "readwrite");
            var newStore = new ObjectStore(tx.objectStore(store.name));

            return newStore.put(value, key).then(function(_key) {
              db.close();
              return _key;
            });
          });
        });
      },

      indexNames: null,

      index: function(name) {
        return new Index(this._idbObjectStore.index(name), this);
      },

      createIndex: function(name, keyPath, params) {
        var store = this._idbObjectStore,
            index = store.createIndex(name, keyPath, params);

        this.indexNames = store.indexNames;
        return new Index(index, this);
      },

      deleteIndex: function(name) {
        var store = this._idbObjectStore,
            res = store.deleteIndex(name);

        this.indexNames = store.indexNames;
        return res;
      }
    };


    __exports__.ObjectStore = ObjectStore;
  });
define("eidb/promise",
  ["exports"],
  function(__exports__) {
    "use strict";
    var RSVP;

    if (window.RSVP) {
      RSVP = window.RSVP;
    } else if (window.Ember) {
      RSVP = window.Ember.RSVP;
    }

    var Promise = RSVP.Promise;


    __exports__.Promise = Promise;
    __exports__.RSVP = RSVP;
  });
define("eidb/transaction",
  ["eidb/object_store","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ObjectStore = __dependency1__.ObjectStore;

    // transactions have onerror, onabort, and oncomplete events
    var Transaction = function(idbTransaction) {
      this._idbTransaction = idbTransaction;
    };

    Transaction.prototype = {
      _idbTransaction: null,

      objectStore: function(name) {
        return new ObjectStore(this._idbTransaction.objectStore(name));
      }
    };


    __exports__.Transaction = Transaction;
  });
define("eidb/utils",
  ["eidb/promise","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Promise = __dependency1__.Promise;

    function __instrument__(methodCallback) {
      if (__instrument__.setup) {
        return __instrument__.setup(methodCallback);
      }
      return methodCallback();
    }

    function _warn(condition, statement) {
      if (condition) { console.warn(statement); }
    }

    function _request(idbObj, method, args) {
      var _args = args ? Array.prototype.slice.call(args) : null;

      return new Promise(function(resolve, reject) {
        var req = idbObj[method].apply(idbObj, _args);

        req.onsuccess = function(evt) {
          resolve(evt.target.result);
        };
        req.onerror = function(evt) {
          reject(evt);
        };
      });
    }

     function _openCursor(idbObj, range, direction, onsuccess, opts) {
        var method = opts && opts.keyOnly ? "openKeyCursor" : "openCursor";

        range = range || null;
        direction = direction || 'next';

        return new Promise(function(resolve, reject) {
          var req = idbObj[method](range, direction);

          req.onsuccess = function(event) {
            onsuccess(event.target.result, resolve);
          };
          req.onerror = function(event) {
            reject(event);
          };
        });
      }

      function _getAll(idbObj, range, direction) {
        var res = [];

        return _openCursor(idbObj, range, direction, function(cursor, resolve) {
          if (cursor) {
            res.push(cursor.value);
            cursor.continue();
          } else {
            resolve(res);
          }
        });
      }


    __exports__.__instrument__ = __instrument__;
    __exports__._warn = _warn;
    __exports__._request = _request;
    __exports__._openCursor = _openCursor;
    __exports__._getAll = _getAll;
  });
define("eidb",
  ["eidb/eidb","eidb/database","eidb/object_store","eidb/transaction","eidb/index","eidb/utils","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __exports__) {
    "use strict";
    var open = __dependency1__.open;
    var _delete = __dependency1__._delete;
    var version = __dependency1__.version;
    var webkitGetDatabaseNames = __dependency1__.webkitGetDatabaseNames;
    var bumpVersion = __dependency1__.bumpVersion;
    var createObjectStore = __dependency1__.createObjectStore;
    var deleteObjectStore = __dependency1__.deleteObjectStore;
    var createIndex = __dependency1__.createIndex;
    var addRecord = __dependency1__.addRecord;
    var getRecord = __dependency1__.getRecord;
    var putRecord = __dependency1__.putRecord;
    var deleteRecord = __dependency1__.deleteRecord;
    var getAll = __dependency1__.getAll;
    var Database = __dependency2__.Database;
    var ObjectStore = __dependency3__.ObjectStore;
    var Transaction = __dependency4__.Transaction;
    var Index = __dependency5__.Index;
    var __instrument__ = __dependency6__.__instrument__;

    __exports__.delete = _delete;

    // TODO - don't make __instrument__ public. (For now, need it for testing.)

    __exports__.open = open;
    __exports__.version = version;
    __exports__.webkitGetDatabaseNames = webkitGetDatabaseNames;
    __exports__.bumpVersion = bumpVersion;
    __exports__.createObjectStore = createObjectStore;
    __exports__.deleteObjectStore = deleteObjectStore;
    __exports__.createIndex = createIndex;
    __exports__.addRecord = addRecord;
    __exports__.getRecord = getRecord;
    __exports__.putRecord = putRecord;
    __exports__.deleteRecord = deleteRecord;
    __exports__.getAll = getAll;
    __exports__.Database = Database;
    __exports__.ObjectStore = ObjectStore;
    __exports__.Transaction = Transaction;
    __exports__.Index = Index;
    __exports__.__instrument__ = __instrument__;
  });
window.EIDB = requireModule("eidb");
})(window);
