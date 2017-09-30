'use strict';

let Climb = require('../helpers/climb');

function get(req, res) {

    Climb.findAllClimbs().then(result=>{
        result.toArray(function(err, arrResult){
            res.json(arrResult);
        });
    });

}

function post(req, res){


    let days = Climb.init( req.body.h, req.body.u, req.body.d, req.body.f );
    Climb.log(days).then(results=>{
        res.json(results.climb);
    });

}

module.exports = {
    getClimbs: get,
    newClimb: post
};