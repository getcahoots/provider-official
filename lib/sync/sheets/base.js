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

var gsheets = require('gsheets');
var debug = require('debug')('cahoots:provider:official:sheets:BaseSheet');
var VError = require('verror');

const KEY = process.env.CAHOOTS_PROVIDER_OFFICIAL_SHEET_KEY;

module.exports = BaseSheet;

function BaseSheet () {}

BaseSheet.prototype.$fetch = function $fetch (sheetName, callback) {

    function onGetWorksheet (err, res) {
        if (err) {
            return callback(new VError(err, 'failed to fetch content from Google Spreadsheet'));
        }

        debug('received data from "%s" sheet (last updated: %s)', sheetName, res.updated);

        callback(null, res.data);
    }

    debug('request data from "%s" sheet', sheetName);

    gsheets.getWorksheet(KEY, sheetName, onGetWorksheet);
};
