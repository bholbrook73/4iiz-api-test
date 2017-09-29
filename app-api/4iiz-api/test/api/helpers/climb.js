const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const Climb = require('../../../api/helpers/climb');


describe('helpers', function() {

    describe('climb', function() {

        describe('Successful Climbs', function() {

            const SUCCESS = "Success";

            it('Should Succeed on day 3: (6,3,1,10)', function (done) {

                try {
                    let results = Climb.init(6,3,1,10);
                    let lastDay = results.pop();
                    lastDay.result.should.eql(SUCCESS);
                    lastDay.day.should.equal(3);
                }
                catch (e) {
                    should.not.exist(e);
                }
                finally {
                    done();
                }

            });

            it('Should Succeed on day 20: (50,6,3,1)', function (done) {

                try {
                    let results = Climb.init(50,6,3,1);
                    let lastDay = results.pop();
                    lastDay.result.should.eql(SUCCESS);
                    lastDay.day.should.equal(20);
                }
                catch (e) {
                    should.not.exist(e);
                }
                finally {
                    done();
                }

            });

        });

        describe('Unsuccessful Climbs', function() {

            const FAILURE = "Failed";

            it('Should Fail on day 4: (10,2,1,50)', function(done) {

                try
                {
                    let results = Climb.init(10,2,1,50);
                    let lastDay = results.pop();
                    lastDay.result.should.eql(FAILURE);
                    lastDay.day.should.equal(4);
                }
                catch(e)
                {
                    should.not.exist(e);
                }
                finally
                {
                    done();
                }

            });

            it('Should Fail on day 7: (50,5,3,14)', function(done) {

                try
                {
                    let results = Climb.init(50,5,3,14);
                    let lastDay = results.pop();
                    lastDay.result.should.eql(FAILURE);
                    lastDay.day.should.equal(7);
                }
                catch(e)
                {
                    should.not.exist(e);
                }
                finally
                {
                    done();
                }

            });

            it('Should Fail on day 68: (50,6,4,1)', function(done) {

                try
                {
                    let results = Climb.init(50,6,4,1);
                    let lastDay = results.pop();
                    lastDay.result.should.eql(FAILURE);
                    lastDay.day.should.equal(68);
                }
                catch(e)
                {
                    should.not.exist(e);
                }
                finally
                {
                    done();
                }

            });

            it('Should Fail on day 2: (1,1,1,1)', function(done) {

                try
                {
                    let results = Climb.init(1,1,1,1);
                    let lastDay = results.pop();
                    lastDay.result.should.eql(FAILURE);
                    lastDay.day.should.equal(2);
                }
                catch(e)
                {
                    should.not.exist(e);
                }
                finally
                {
                    done();
                }

            });

        });

    });

});