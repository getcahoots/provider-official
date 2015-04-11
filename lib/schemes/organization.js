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

module.exports = {

    insert: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'info'],
        properties: {
            name: {
                type: 'string'
            },
            info: {
                type: 'string',
                format: 'uri'
            },
            modified: {
                type: 'number'
            },
            created: {
                type: 'number'
            }
        }
    }

};
