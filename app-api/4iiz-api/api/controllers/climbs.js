'use strict';

let Climb = require('../helpers/climb');

module.exports = {
    getClimbs: get,
    newClimb: post
};

function get(req, res) {

    res.json();

}

function post(req, res){


    //let response = Climb.init( req.body.h, req.body.u, req.body.d, req.body.f );

    //res.json(response);
    res.json();

}
