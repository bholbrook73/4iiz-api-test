const should = require('should');
const request = require('supertest');
const server = require('../../../app');


describe('controllers', function() {

    describe('climbs', function() {

        describe('POST /climbs', function() {

            it('Should successfully make a post', function(done) {

                request(server)
                    .post('/climbs')
                    .send({ h: 6, u: 3, d: 1, f: 10 })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        climbId = res.body._id;
                        should.not.exist(err);
                        done();
                    });

            });

        });

        describe('GET /climbs', function() {

            it('Should successfully retrieve all climbs', function(done) {

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

    describe('climbs', function() {

        describe('GET /climbs/{climbId}', function() {

            it('Should successfully retrieve all climbs', function(done) {

                request(server)
                    .get('/climbs')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {

                        request(server)
                            .get(`/climbs/${res.body[0]._id}`)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function(err, res) {
                                res.body.length.should.eql(3);
                                should.not.exist(err);
                                done();
                            });

                    });



            });

        });

    });

});