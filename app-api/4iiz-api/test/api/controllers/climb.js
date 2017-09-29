const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const Climb = require('../../../api/helpers/climb');


describe('controllers', function() {

    describe('climbs', function() {

        describe('GET /climbs', function() {

            it('Should ?', function(done) {

                request(server)
                    .get('/climbs')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        done();
                    });

            });

        });

        describe('POST /climbs', function() {

            it('Should ?', function(done) {

                request(server)
                    .get('/climbs')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err);
                        done();
                    });

            });

        });

    });

});