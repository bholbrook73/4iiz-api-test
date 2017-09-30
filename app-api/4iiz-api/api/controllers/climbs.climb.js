'use strict';

let Climb = require('../helpers/climb');

function get(req, res) {

    Climb.findAllMovesByClimb( req.swagger.params.climbId.value ).then(result=>{
        result.toArray(function(err, arrResult){
            res.json(arrResult);
        });
    });

}

module.exports = {
    getClimb: get
};