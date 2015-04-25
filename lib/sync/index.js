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

var debug = require('debug')('cahoots:provider:official:sync');
var mandatory = require('mandatory');
var series = require('async-light').series;

var sheets = require('./sheets');
var VError = require('verror');

const DEFAULT_INTERVAL = (60 * 1000) * 5;

module.exports = function instantiate (buckets, interval) {
    mandatory(buckets).is('function', 'Please pass the storage buckets');

    let sync = new CahootsSync(buckets, interval || DEFAULT_INTERVAL);

    sync.run();
};

function CahootsSync (buckets, interval) {
    this.$buckets = buckets;
    this.$worker = setInterval(this.run.bind(this), interval);
}

CahootsSync.prototype.$storeOrganizations = function $storeOrganizations (organizations, callback) {
    var tasks = [];
    var organizationBucket = this.$buckets('organization');

    function onDone (err) {
        if (err) {
            return callback(new VError(err, 'failed to store all organizations'));
        }

        return callback(null);
    }

    organizations.forEach(function onEach (organization) {
        tasks.push(function insert (done) {
            function onInsert (err) {
                if (err) {
                    return done(new VError(err, 'failed to insert the organization'));
                }

                done(null);
            }

            organizationBucket.insert(organization, onInsert);
        });
    });

    series(tasks, onDone);
};

// TODO: DRY
CahootsSync.prototype.$storePersons = function $storePersons (persons, callback) {
    var tasks = [];
    var personBucket = this.$buckets('person');

    function onDone (err) {
        if (err) {
            return callback(new VError(err, 'failed to store all persons'));
        }

        return callback(null);
    }

    persons.forEach(function onEach (person) {
        tasks.push(function insert (done) {
            function onInsert (err) {
                if (err) {
                    return done(new VError(err, 'failed to insert the person'));
                }

                done(null);
            }

            personBucket.insert(person, onInsert);
        });
    });

    series(tasks, onDone);
};

CahootsSync.prototype.run = function run () {

    var self = this;
    var organizations = [];
    var persons = [];
    var cahoots = [];

    function onFetchOrganizations (err, fetched) {
        if (err) {
            return debug('[ERROR] failed to fetch all organizations: %s', err.message);
        }

        debug('-> 1. fetched all organizations.');

        organizations.push.apply(organizations, fetched);

        debug('2. wipe the storage');

        self.$buckets.destroy(onDestroy);
    }

    function onDestroy (err) {
        if (err) {
            return debug('[ERROR] failed to clean the database before inserting the fresh data: %s', err.message);
        }

        debug('-> 2. wiped the storage');

        debug('3. store all `organizations`');

        self.$storeOrganizations(organizations, onStoreOrganizations);
    }

    function onStoreOrganizations (err) {
        if (err) {
            return debug('[ERROR] failed to store all organizations: %s', err.message);
        }

        debug('-> 3. stored all `organizations`');

        debug('4. fetch all persons');

        sheets('persons').findAll(onFetchPersons);
    }

    function onFetchPersons (err, fetched) {
        if (err) {
            return debug('[ERROR] failed to fetch all persons: %s', err.message);
        }

        debug('-> 4. fetched all persons');

        persons.push.apply(persons, fetched);

        debug('5. fetch all cahoots');

        sheets('cahoots').findAll(onFetchCahoots);
    }

    function onFetchCahoots (err, fetched) {
        if (err) {
            return debug('[ERROR] failed to fetch all cahoots: %s', err.message);
        }

        debug('-> 5. fetched all cahoots');

        cahoots.push.apply(cahoots, fetched);

        debug('6. Map the cahoots to the persons');

        persons.map(function onMap (person) {
            person.cahoots = cahoots.filter(function onMap (cahoot) {
                if (cahoot.person === person.id) {
                    delete cahoot.person;

                    // Fix data type
                    if (typeof cahoot.verified === 'string') {
                        cahoot.verified = cahoot.verified.toLowerCase().trim();
                        cahoot.verified = (cahoot.verified === 'true');
                    }

                    // Remove empty values
                    Object.keys(cahoot).forEach(function onEach (key) {
                        if (cahoot[key] === null) {
                            delete cahoot[key];
                        }
                    });

                    return cahoot;
                }
            });
        });

        debug('-> 6. Mapped the cahoots into the persons');

        debug('7. Store all persons');

        self.$storePersons(persons, onStorePersons);
    }

    function onStorePersons (err) {
        if (err) {
            return debug('[ERROR] failed to store all persons: %s', err.message);
        }

        debug('-> 7. Stored all persons');

        debug('sync process finished successfully (synced %d person(s))', persons.length);
    }

    debug('about to start the sync process.');
    debug('1. fetching all organizations');

    sheets('organizations').findAll(onFetchOrganizations);
};
