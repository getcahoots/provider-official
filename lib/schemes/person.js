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
        required: ['name', 'info', 'cahoots'],
        properties: {
            name: {
                type: 'string'
            },
            info: {
                type: 'string',
                format: 'uri'
            },
            cahoots: {
                type: 'array',
                items: {
                    oneOf: [
                        {
                            type: 'object',
                            additionalProperties: false,
                            required: ['organization', 'source'],
                            properties: {
                                organization: {
                                    // TODO: Add pattern
                                    type: 'string'

                                },
                                source: {
                                    type: 'string',
                                    format: 'uri'
                                },
                                role: {
                                    type: 'string'
                                },
                                verified: {
                                    type: 'boolean'
                                }
                            }
                        }
                    ]
                }
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
