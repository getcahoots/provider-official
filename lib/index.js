/*
 * @getcahoots/provider-official
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */

/**
 * @author André König <andre@cahoots.ninja>
 *
 */

'use strict';

const AVAILABLE_ENTITIES = ['person', 'organization'];
const CONFIG_DB_PATH = process.env.CAHOOTS_PROVIDER_OFFICIAL_DATABASE_PATH;
const CONFIG_SYNC_INTERVAL = process.env.CAHOOTS_PROVIDER_OFFICIAL_SYNC_INTERVAL;

var debug = require('debug')('cahoots:provider:official');
var mandatory = require('mandatory');
var VError = require('verror');

var bucketdb = require('bucketdb')(CONFIG_DB_PATH);
var sync = require('./sync');

sync(bucketdb, CONFIG_SYNC_INTERVAL);

module.exports = function initialize (type) {
    if (!~AVAILABLE_ENTITIES.indexOf(type)) {
        throw new VError('failed to return the official entity "%s". It does not exist. Available entities are: %j', type, AVAILABLE_ENTITIES);
    }

    let entity = new Entity(type);

    return {
        query: entity.query.bind(entity)
    };
};

function Entity (type) {
    this.$type = type;
    this.$bucket = bucketdb(type);
}

Entity.prototype.query = function query (q, callback) {
    mandatory(q).is('object', 'Please provide a proper query object');
    mandatory(callback).is('function', 'Please provide a proper callback function');

    let self = this;

    function onQuery (err, results) {
        if (err) {
            debug('failed to execute query "%j" on the "%s" entity', q, self.$type);
            return callback(new VError(err, 'failed to execute query "%j" on the "%s" entity', q, self.$type));
        }

        debug('queried the "%s" bucket successfully (%d result(s))', self.$type, results.length);

        callback(null, results);
    }

    debug('about to query the "%s" bucket', this.$type);

    this.$bucket.query(q, onQuery);
};
