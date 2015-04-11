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

var mandatory = require('mandatory');

var schemes = {
    person: require('./person'),
    organization: require('./organization')
};

module.exports = function get (type, action) {
    var schema = {};

    mandatory(type).is('string', 'Please define a type of the schema you want to grab.');

    schema = schemes[type] || {};

    return schema[action];
};
