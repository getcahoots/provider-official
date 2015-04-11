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

describe('The "PersonEntity"', function suite () {

    it('should be able to handle a validation problem on insert', function test (done) {
        var person = provider('person');

        function onInsert (err) {
            expect(err).not.to.be(null);

            done();
        }

        person.insert({}, onInsert);
    });

    it('should be able to handle the insertion of a valid person', function test (done) {
        var person = provider('person');

        var pers = {
            name: 'André König',
            info: 'http://andrekoenig.info',
            cahoots: [{
                organization: '1e4328a20169b9dfa1f98d2fb4d1ca1b4542d01a',
                source: 'http://cahoots.pw',
                role: 'Software Architect',
                verified: true
            }]
        };

        function onInsert (err, insertedPerson) {
            expect(err).to.be(null);

            person.query({id: insertedPerson.id}, onQuery);
        }

        function onQuery (err, results) {
            expect(err).to.be(null);

            expect(util.isArray(results)).to.be(true);
            expect(results.length).to.be(1);

            done();
        }

        person.insert(pers, onInsert);
    });

});
