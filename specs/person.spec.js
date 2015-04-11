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

var util = require('util');

var expect = require('expect.js');

var provider = require('..');

describe('The "OrganizationEntity"', function suite () {

    it('should be able to handle a validation problem on insert', function test (done) {
        var organization = provider('organization');

        function onInsert (err) {
            expect(err).not.to.be(null);

            done();
        }

        organization.insert({}, onInsert);
    });

    it('should be able to handle the insertion of a valid organization', function test (done) {
        var organization = provider('organization');

        var org = {
            name: 'Cahoots',
            info: 'http://cahoots.pw'
        };

        function onInsert (err, insertedOrg) {
            expect(err).to.be(null);

            organization.query({id: insertedOrg.id}, onQuery);
        }

        function onQuery (err, results) {
            expect(err).to.be(null);

            expect(util.isArray(results)).to.be(true);
            expect(results.length).to.be(1);

            done();
        }

        organization.insert(org, onInsert);
    });

});
