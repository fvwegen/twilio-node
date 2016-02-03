'use strict';

var _ = require('lodash');
var Q = require('q');
var InstanceContext = require('../../../../../../base/InstanceContext');
var InstanceResource = require('../../../../../../base/InstanceResource');
var Page = require('../../../../../../base/Page');
var deserialize = require('../../../../../../base/deserialize');
var values = require('../../../../../../base/values');

var CredentialPage;
var CredentialList;
var CredentialInstance;
var CredentialContext;

/**
 * @constructor
 * @augments Page
 * @description Initialize the CredentialPage
 *
 * @param {V2010} version - Version that contains the resource
 * @param {object} response - Response from the API
 * @param {string} accountSid - The account_sid
 * @param {string} credentialListSid - The credential_list_sid
 *
 * @returns CredentialPage
 */
function CredentialPage(version, response, accountSid, credentialListSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    credentialListSid: credentialListSid
  };
}

_.extend(CredentialPage.prototype, Page.prototype);
CredentialPage.prototype.constructor = CredentialPage;

/**
 * Build an instance of CredentialInstance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns CredentialInstance
 */
CredentialPage.prototype.getInstance = function getInstance(payload) {
  return new CredentialInstance(
    this._version,
    payload,
    this._solution.accountSid,
    this._solution.credentialListSid
  );
};


/**
 * @constructor
 * @description Initialize the CredentialList
 *
 * @param {V2010} version - Version that contains the resource
 * @param {string} accountSid - The account_sid
 * @param {string} credentialListSid - The credential_list_sid
 *
 * @returns {function} - CredentialListInstance
 */
function CredentialList(version, accountSid, credentialListSid) {
  /**
   * @memberof CredentialList
   *
   * @param {string} sid - sid of instance
   *
   * @returns CredentialContext
   */
  function CredentialListInstance(sid) {
    return CredentialListInstance.get(sid);
  }

  CredentialListInstance._version = version;
  // Path Solution
  CredentialListInstance._solution = {
    accountSid: accountSid,
    credentialListSid: credentialListSid
  };
  CredentialListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/SIP/CredentialLists/<%= credentialListSid %>/Credentials.json' // jshint ignore:line
  )(CredentialListInstance._solution);
  /**
   * @memberof CredentialList
   *
   * @description Streams CredentialInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         list() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  CredentialListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /**
   * @memberof CredentialList
   *
   * @description Lists CredentialInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  CredentialListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource) {
      allResources.push(resource);
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /**
   * @memberof CredentialList
   *
   * @description Retrieve a single page of CredentialInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  CredentialListInstance.page = function page(opts, callback) {
    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new CredentialPage(
        this._version,
        payload,
        this._solution.accountSid,
        this._solution.credentialListSid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /**
   * @memberof CredentialList
   *
   * @description Create a new CredentialInstance
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @param {object} opts - ...
   * @param {string} opts.username - The username
   * @param {string} opts.password - The password
   * @param {function} [callback] - Callback to handle created record
   *
   * @returns {Promise} Resolves to newly created CredentialInstance
   */
  CredentialListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameters username, password are missing.');  // jshint ignore:line
    }
    if (_.isUndefined(opts.username)) {
      throw new Error('Required parameter "username" missing.');
    }
    if (_.isUndefined(opts.password)) {
      throw new Error('Required parameter "password" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'Username': opts.username,
      'Password': opts.password
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new CredentialInstance(
        this._version,
        payload,
        this._solution.accountSid,
        this._solution.credentialListSid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /**
   * @memberof CredentialList
   *
   * @description Constructs a CredentialContext
   *
   * @param {string} sid - The sid
   *
   * @returns CredentialContext
   */
  CredentialListInstance.get = function get(sid) {
    return new CredentialContext(
      this._version,
      this._solution.accountSid,
      this._solution.credentialListSid,
      sid
    );
  };

  return CredentialListInstance;
}


/**
 * @constructor
 * @augments InstanceResource
 * @description Initialize the CredentialContext
 *
 * @property {string} sid - The sid
 * @property {string} accountSid - The account_sid
 * @property {string} credentialListSid - The credential_list_sid
 * @property {string} username - The username
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} uri - The uri
 *
 * @param {V2010} version - Version that contains the resource
 * @param {object} payload - The instance payload
 * @param {sid} accountSid - The account_sid
 * @param {sid} credentialListSid - The credential_list_sid
 * @param {sid} sid - The sid
 */
function CredentialInstance(version, payload, accountSid, credentialListSid,
                             sid) {
  InstanceResource.prototype.constructor.call(this, version);

  // Marshaled Properties
  this._properties = {
    sid: payload.sid, // jshint ignore:line,
    accountSid: payload.account_sid, // jshint ignore:line,
    credentialListSid: payload.credential_list_sid, // jshint ignore:line,
    username: payload.username, // jshint ignore:line,
    dateCreated: deserialize.rfc2822DateTime(payload.date_created), // jshint ignore:line,
    dateUpdated: deserialize.rfc2822DateTime(payload.date_updated), // jshint ignore:line,
    uri: payload.uri, // jshint ignore:line,
  };

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
    credentialListSid: credentialListSid,
    sid: sid || this._properties.sid,
  };
}

_.extend(CredentialInstance.prototype, InstanceResource.prototype);
CredentialInstance.prototype.constructor = CredentialInstance;

Object.defineProperty(CredentialInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new CredentialContext(
        this._version,
        this._solution.accountSid,
        this._solution.credentialListSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'sid', {
  get: function() {
    return this._properties.sid;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'accountSid', {
  get: function() {
    return this._properties.accountSid;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'credentialListSid', {
  get: function() {
    return this._properties.credentialListSid;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'username', {
  get: function() {
    return this._properties.username;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'dateCreated', {
  get: function() {
    return this._properties.dateCreated;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'dateUpdated', {
  get: function() {
    return this._properties.dateUpdated;
  },
});

Object.defineProperty(CredentialInstance.prototype,
  'uri', {
  get: function() {
    return this._properties.uri;
  },
});

/**
 * @description Fetch a CredentialInstance
 *
 * @param {function} [callback] - Callback to handle fetched record
 *
 * @returns {Promise} Resolves to fetched CredentialInstance
 */
CredentialInstance.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new CredentialInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.credentialListSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/**
 * @description Update the CredentialInstance
 *
 * If a function is passed as the first argument, it will be used as the callback function.
 *
 * @param {object} opts - ...
 * @param {string} opts.username - The username
 * @param {string} opts.password - The password
 * @param {function} [callback] - Callback to handle updated record
 *
 * @returns {Promise} Resolves to updated CredentialInstance
 */
CredentialInstance.prototype.update = function update(opts, callback) {
  if (_.isUndefined(opts)) {
    throw new Error('Required parameters username, password are missing.');  // jshint ignore:line
  }
  if (_.isUndefined(opts.username)) {
    throw new Error('Required parameter "username" missing.');
  }
  if (_.isUndefined(opts.password)) {
    throw new Error('Required parameter "password" missing.');
  }

  var deferred = Q.defer();
  var data = values.of({
    'Username': opts.username,
    'Password': opts.password
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new CredentialInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.credentialListSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/**
 * @description Deletes the CredentialInstance
 *
 * @param {function} [callback] - Callback to handle deleted record
 *
 * @returns Resolves to true if delete succeeds, false otherwise
 */
CredentialInstance.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};


/**
 * @constructor
 * @augments InstanceContext
 * @description Initialize the CredentialContext
 *
 * @param {V2010} version - Version that contains the resource
 * @param {sid} accountSid - The account_sid
 * @param {sid} credentialListSid - The credential_list_sid
 * @param {sid} sid - The sid
 */
function CredentialContext(version, accountSid, credentialListSid, sid) {
  InstanceContext.prototype.constructor.call(this, version);

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    credentialListSid: credentialListSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Accounts/<%= accountSid %>/SIP/CredentialLists/<%= credentialListSid %>/Credentials/<%= sid %>.json' // jshint ignore:line
  )(this._solution);
}

_.extend(CredentialContext.prototype, InstanceContext.prototype);
CredentialContext.prototype.constructor = CredentialContext;

/**
 * @description Fetch a CredentialInstance
 *
 * @param {function} [callback] - Callback to handle fetched record
 *
 * @returns {Promise} Resolves to fetched CredentialInstance
 */
CredentialContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new CredentialInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.credentialListSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/**
 * @description Update the CredentialInstance
 *
 * If a function is passed as the first argument, it will be used as the callback function.
 *
 * @param {object} opts - ...
 * @param {string} opts.username - The username
 * @param {string} opts.password - The password
 * @param {function} [callback] - Callback to handle updated record
 *
 * @returns {Promise} Resolves to updated CredentialInstance
 */
CredentialContext.prototype.update = function update(opts, callback) {
  if (_.isUndefined(opts)) {
    throw new Error('Required parameters username, password are missing.');  // jshint ignore:line
  }
  if (_.isUndefined(opts.username)) {
    throw new Error('Required parameter "username" missing.');
  }
  if (_.isUndefined(opts.password)) {
    throw new Error('Required parameter "password" missing.');
  }

  var deferred = Q.defer();
  var data = values.of({
    'Username': opts.username,
    'Password': opts.password
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new CredentialInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.credentialListSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/**
 * @description Deletes the CredentialInstance
 *
 * @param {function} [callback] - Callback to handle deleted record
 *
 * @returns Resolves to true if delete succeeds, false otherwise
 */
CredentialContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  CredentialPage: CredentialPage,
  CredentialList: CredentialList,
  CredentialInstance: CredentialInstance,
  CredentialContext: CredentialContext
};