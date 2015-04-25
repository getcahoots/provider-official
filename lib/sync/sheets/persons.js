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

var util = require('util');

var debug = require('debug')('cahoots:provider:official:sheets:PersonsSheet');
var mandatory = require('mandatory');
var VError = require('verror');

var BaseSheet = require('./base');

module.exports = function instantiate () {
    var persons = new PersonsSheet();

    return {
        findAll: persons.findAll.bind(persons)
    };
};

function PersonsSheet () {
    this.$name = 'persons';

    BaseSheet.call(this);
}

util.inherits(PersonsSheet, BaseSheet);

PersonsSheet.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please provide a proper callback function');

    function onFetch (err, rows) {
        if (err) {
            return callback(new VError(err, 'failed to fetch all persons from the spreadsheet'));
        }

        debug('received all persons from sheet (found %d person(s))', rows.length);

        callback(null, rows);
    }

    debug('request all persons from sheet');

    this.$fetch(this.$name, onFetch);
};
