'use strict';

/* jshint ignore:start */
/**
 * This code was generated by
 * \ / _    _  _|   _  _
 *  | (_)\/(_)(_|\/| |(/_  v1.0.0
 *       /       /
 */
/* jshint ignore:end */

var Q = require('q');  /* jshint ignore:line */
var _ = require('lodash');  /* jshint ignore:line */
var AssignedAddOnExtensionList = require(
    './assignedAddOn/assignedAddOnExtension').AssignedAddOnExtensionList;
var Page = require('../../../../../base/Page');  /* jshint ignore:line */
var deserialize = require(
    '../../../../../base/deserialize');  /* jshint ignore:line */
var values = require('../../../../../base/values');  /* jshint ignore:line */

var AssignedAddOnList;
var AssignedAddOnPage;
var AssignedAddOnInstance;
var AssignedAddOnContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
 * @description Initialize the AssignedAddOnList
 * PLEASE NOTE that this class contains beta products that are subject to change. Use them with caution.
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {string} accountSid - The Account id that has installed this Add-on
 * @param {string} resourceSid - The Phone Number id that has installed this Add-on
 */
/* jshint ignore:end */
AssignedAddOnList = function AssignedAddOnList(version, accountSid, resourceSid)
                                                {
  /* jshint ignore:start */
  /**
   * @function assignedAddOns
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext}
   */
  /* jshint ignore:end */
  function AssignedAddOnListInstance(sid) {
    return AssignedAddOnListInstance.get(sid);
  }

  AssignedAddOnListInstance._version = version;
  // Path Solution
  AssignedAddOnListInstance._solution = {
    accountSid: accountSid,
    resourceSid: resourceSid
  };
  AssignedAddOnListInstance._uri = _.template(
    '/Accounts/<%= accountSid %>/IncomingPhoneNumbers/<%= resourceSid %>/AssignedAddOns.json' // jshint ignore:line
  )(AssignedAddOnListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams AssignedAddOnInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  AssignedAddOnListInstance.each = function each(opts, callback) {
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
    var currentResource = 0;
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
          if (done || (!_.isUndefined(opts.limit) && currentResource >= opts.limit)) {
            done = true;
            return false;
          }

          currentResource++;
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

    fetchNextPage(_.bind(this.page, this, _.merge(opts, limits)));
  };

  /* jshint ignore:start */
  /**
   * @description Lists AssignedAddOnInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
   * @instance
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
  /* jshint ignore:end */
  AssignedAddOnListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
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

  /* jshint ignore:start */
  /**
   * Retrieve a single page of AssignedAddOnInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
   * @instance
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
  /* jshint ignore:end */
  AssignedAddOnListInstance.page = function page(opts, callback) {
    opts = opts || {};

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
      deferred.resolve(new AssignedAddOnPage(
        this._version,
        payload,
        this._solution
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

  /* jshint ignore:start */
  /**
   * Retrieve a single target page of AssignedAddOnInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function getPage
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
   * @instance
   *
   * @param {string} [targetUrl] - API-generated URL for the requested results page
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  AssignedAddOnListInstance.getPage = function getPage(targetUrl, callback) {
    var deferred = Q.defer();

    var promise = this._version._domain.twilio.request({
      method: 'GET',
      uri: targetUrl
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new AssignedAddOnPage(
        this._version,
        payload,
        this._solution
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

  /* jshint ignore:start */
  /**
   * create a AssignedAddOnInstance
   *
   * @function create
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.installedAddOnSid -
   *          A string that uniquely identifies the Add-on installation
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed AssignedAddOnInstance
   */
  /* jshint ignore:end */
  AssignedAddOnListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.installedAddOnSid)) {
      throw new Error('Required parameter "opts.installedAddOnSid" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'InstalledAddOnSid': _.get(opts, 'installedAddOnSid')
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new AssignedAddOnInstance(
        this._version,
        payload,
        this._solution.accountSid,
        this._solution.resourceSid,
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

  /* jshint ignore:start */
  /**
   * Constructs a assigned_add_on
   *
   * @function get
   * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnList
   * @instance
   *
   * @param {string} sid - The unique Installed Add-on Sid
   *
   * @returns {Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext}
   */
  /* jshint ignore:end */
  AssignedAddOnListInstance.get = function get(sid) {
    return new AssignedAddOnContext(
      this._version,
      this._solution.accountSid,
      this._solution.resourceSid,
      sid
    );
  };

  return AssignedAddOnListInstance;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnPage
 * @augments Page
 * @description Initialize the AssignedAddOnPage
 * PLEASE NOTE that this class contains beta products that are subject to change. Use them with caution.
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns AssignedAddOnPage
 */
/* jshint ignore:end */
AssignedAddOnPage = function AssignedAddOnPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
};

_.extend(AssignedAddOnPage.prototype, Page.prototype);
AssignedAddOnPage.prototype.constructor = AssignedAddOnPage;

/* jshint ignore:start */
/**
 * Build an instance of AssignedAddOnInstance
 *
 * @function getInstance
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns AssignedAddOnInstance
 */
/* jshint ignore:end */
AssignedAddOnPage.prototype.getInstance = function getInstance(payload) {
  return new AssignedAddOnInstance(
    this._version,
    payload,
    this._solution.accountSid,
    this._solution.resourceSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnInstance
 * @description Initialize the AssignedAddOnContext
 * PLEASE NOTE that this class contains beta products that are subject to change. Use them with caution.
 *
 * @property {string} sid -
 *          A string that uniquely identifies this assigned Add-on installation
 * @property {string} accountSid - The Account id that has installed this Add-on
 * @property {string} resourceSid -
 *          The Phone Number id that has installed this Add-on
 * @property {string} friendlyName - A description of this Add-on installation
 * @property {string} description - A short description of the Add-on functionality
 * @property {string} configuration -
 *          The JSON object representing the current configuration
 * @property {string} uniqueName -
 *          The string that uniquely identifies this Add-on installation
 * @property {Date} dateCreated - The date this Add-on was installed
 * @property {Date} dateUpdated -
 *          The date this Add-on installation was last updated
 * @property {string} uri - The uri
 * @property {string} subresourceUris - The subresource_uris
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} accountSid - The account_sid
 * @param {sid} resourceSid - The resource_sid
 * @param {sid} sid - The unique Installed Add-on Sid
 */
/* jshint ignore:end */
AssignedAddOnInstance = function AssignedAddOnInstance(version, payload,
                                                        accountSid, resourceSid,
                                                        sid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.resourceSid = payload.resource_sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.description = payload.description; // jshint ignore:line
  this.configuration = payload.configuration; // jshint ignore:line
  this.uniqueName = payload.unique_name; // jshint ignore:line
  this.dateCreated = deserialize.rfc2822DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.rfc2822DateTime(payload.date_updated); // jshint ignore:line
  this.uri = payload.uri; // jshint ignore:line
  this.subresourceUris = payload.subresource_uris; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    accountSid: accountSid,
    resourceSid: resourceSid,
    sid: sid || this.sid,
  };
};

Object.defineProperty(AssignedAddOnInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new AssignedAddOnContext(
        this._version,
        this._solution.accountSid,
        this._solution.resourceSid,
        this._solution.sid
      );
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a AssignedAddOnInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed AssignedAddOnInstance
 */
/* jshint ignore:end */
AssignedAddOnInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a AssignedAddOnInstance
 *
 * @function remove
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed AssignedAddOnInstance
 */
/* jshint ignore:end */
AssignedAddOnInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * Access the extensions
 *
 * @function extensions
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnInstance
 * @instance
 *
 * @returns {Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext.AssignedAddOnExtensionList}
 */
/* jshint ignore:end */
AssignedAddOnInstance.prototype.extensions = function extensions() {
  return this._proxy.extensions;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext
 * @description Initialize the AssignedAddOnContext
 * PLEASE NOTE that this class contains beta products that are subject to change. Use them with caution.
 *
 * @property {Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext.AssignedAddOnExtensionList} extensions -
 *          extensions resource
 *
 * @param {Twilio.Api.V2010} version - Version of the resource
 * @param {sid} accountSid - The account_sid
 * @param {sid} resourceSid - The resource_sid
 * @param {sid} sid - The unique Installed Add-on Sid
 */
/* jshint ignore:end */
AssignedAddOnContext = function AssignedAddOnContext(version, accountSid,
                                                      resourceSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    accountSid: accountSid,
    resourceSid: resourceSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Accounts/<%= accountSid %>/IncomingPhoneNumbers/<%= resourceSid %>/AssignedAddOns/<%= sid %>.json' // jshint ignore:line
  )(this._solution);

  // Dependents
  this._extensions = undefined;
};

/* jshint ignore:start */
/**
 * fetch a AssignedAddOnInstance
 *
 * @function fetch
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed AssignedAddOnInstance
 */
/* jshint ignore:end */
AssignedAddOnContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new AssignedAddOnInstance(
      this._version,
      payload,
      this._solution.accountSid,
      this._solution.resourceSid,
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

/* jshint ignore:start */
/**
 * remove a AssignedAddOnInstance
 *
 * @function remove
 * @memberof Twilio.Api.V2010.AccountContext.IncomingPhoneNumberContext.AssignedAddOnContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed AssignedAddOnInstance
 */
/* jshint ignore:end */
AssignedAddOnContext.prototype.remove = function remove(callback) {
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

Object.defineProperty(AssignedAddOnContext.prototype,
  'extensions', {
  get: function() {
    if (!this._extensions) {
      this._extensions = new AssignedAddOnExtensionList(
        this._version,
        this._solution.accountSid,
        this._solution.resourceSid,
        this._solution.sid
      );
    }
    return this._extensions;
  }
});

module.exports = {
  AssignedAddOnList: AssignedAddOnList,
  AssignedAddOnPage: AssignedAddOnPage,
  AssignedAddOnInstance: AssignedAddOnInstance,
  AssignedAddOnContext: AssignedAddOnContext
};
