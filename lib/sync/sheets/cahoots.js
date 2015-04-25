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

var debug = require('debug')('cahoots:provider:official:sheets:CahootsSheet');
var mandatory = require('mandatory');
var VError = require('verror');

var BaseSheet = require('./base');

module.exports = function instantiate () {
    var cahoots = new CahootsSheet();

    return {
        findAll: cahoots.findAll.bind(cahoots)
    };
};

function CahootsSheet () {
    this.$name = 'cahoots';

    BaseSheet.call(this);
}

util.inherits(CahootsSheet, BaseSheet);

CahootsSheet.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please provide a proper callback function');

    function onFetch (err, rows) {
        if (err) {
            return callback(new VError(err, 'failed to fetch all cahoots from the spreadsheet'));
        }

        debug('received all cahoots from sheet (found %d cahoots(s))', rows.length);

        callback(null, rows);
    }

    debug('request all cahoots from sheet');

    this.$fetch(this.$name, onFetch);
};
