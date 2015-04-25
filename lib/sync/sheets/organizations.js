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

var debug = require('debug')('cahoots:provider:official:sheets:OrganizationsSheet');
var mandatory = require('mandatory');
var VError = require('verror');

var BaseSheet = require('./base');

module.exports = function instantiate () {
    var organizations = new OrganizationsSheet();

    return {
        findAll: organizations.findAll.bind(organizations)
    };
};

function OrganizationsSheet () {
    this.$name = 'organizations';

    BaseSheet.call(this);
}

util.inherits(OrganizationsSheet, BaseSheet);

OrganizationsSheet.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please provide a proper callback function');

    function onFetch (err, rows) {
        if (err) {
            return callback(new VError(err, 'failed to fetch all organizations from the spreadsheet'));
        }

        debug('received all organizations from sheet (found %d organization(s))', rows.length);

        callback(null, rows);
    }

    debug('request all organizations from sheet');

    this.$fetch(this.$name, onFetch);
}
