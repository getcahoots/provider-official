/*
 * cahoots-provider-official
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

var debug = require('debug')('cahoots:provider:official');
var mandatory = require('mandatory');
var VError = require('verror');

var bucketdb = require('bucketdb')(CONFIG_DB_PATH);

var validator = require('./validator');
var schemes = require('./schemes');

module.exports = function initialize (type) {
    if (!~AVAILABLE_ENTITIES.indexOf(type)) {
        throw new VError('failed to return the official entity "%s". It does not exist. Available entities are: %j', type, AVAILABLE_ENTITIES);
    }

    let entity = new Entity(type);

    return {
        insert: entity.insert.bind(entity),
        update: entity.update.bind(entity),
        query: entity.query.bind(entity)
    };
};

function Entity (type) {
    this.$type = type;
    this.$bucket = bucketdb(type);
}

Entity.prototype.insert = function insert (record, callback) {
    mandatory(record).is('object', 'Please provide an insertable record');
    mandatory(callback).is('function', 'Please provide a proper callback function');

    let self = this;
    let action = 'insert';
    let schema = schemes(this.$type, action);

    function onCheck (err) {
        if (err) {
            return callback(new VError(err, 'failed to validate the given "%s" - malformed.', self.$type));
        }

        self.$bucket[action](record, onInsert);
    }

    function onInsert (err, result) {
        if (err) {
            return callback(new VError(err, 'failed to insert a record on entity "%s"', self.$type));
        }

        callback(null, result);
    }

    validator(schema).check(record, onCheck);
};

Entity.prototype.update = function update (record, callback) {
    mandatory(record).is('object', 'Please provide an updatable record');
    mandatory(callback).is('function', 'Please provide a proper callback function');

    let self = this;

    function onUpdate (err, result) {
        if (err) {
            let error = new VError(err, 'failed to update a record on entity "%s"', self.$type);
            error.type = err.type;

            return callback(error);
        }

        callback(null, result);
    }

    this.$bucket.update(record, onUpdate);
};

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
