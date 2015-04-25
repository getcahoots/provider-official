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

var mandatory = require('mandatory');

const AVAILABLE_SHEETS = {
    'persons': require('./persons'),
    'organizations': require('./organizations'),
    'cahoots': require('./cahoots')
};

module.exports = function create (type) {
    var sheet = AVAILABLE_SHEETS[type];

    mandatory(sheet).is('function', 'Please provide a proper sheet name.');

    return sheet();
};
