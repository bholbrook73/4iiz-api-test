'use strict';

const Mongo = require("./mongo");

/*

The math behind the climb;

u   (up)        The distance UP a snail will climb on the first day
f   (fatigue)   Always percentage of up (u)
s   (slide)     The distance a snail will fall each night. This is static
h   (height)    The height of the well
d   (days)      Number of days it takes the snail to leave

todayClimb = u - (u * f * days)

*/

function doClimb( Snail, days=[] )
{
    const day = {

        // unique id for day
        _id: new Mongo.ObjectId(),

        // the snail that is climbing
        // do not set manially, use attach
        Snail: null,

        // for reporting
        timestamp: Date.now(),

        // current day in sequence of calculation
        day: days.length + 1,

        // tracks changes to the snail's position during this day
        moves: [],

        // result of climb at end of day or null if no result
        result: null,

        // record the state of the snail
        track: function(Snail){
            this.moves.push(Snail.log());
        },

        // binds the snail to the day and records its state
        attach: function(Snail){

            // only attach a snail once
            if(!this.Snail)
            {
                this.Snail = Snail;
                this.track(Snail);
            }
        }

    };

    // attach the snail to the day
    day.attach(Snail);

    // make the day's climb
    Snail.climb(day);

    // check if the snail is still in the well
    if(!Snail.isOutOfWell)
    {
        // slide the snail down for the night
        Snail.slide(day);

        // check fatigue distance
        if(Snail.isFatigued)
        {
            // the snail has fallen back to the well
            day.result = 'Failed'
        }
    }

    // the snail is out! mark the day as successful
    else
    {
        day.result = 'Success';
    }

    // add the day to the days array
    days.push(day);

    // if today has a result, return the completed climb, otherwise, move to tomorrow
    return day.result ? days : doClimb( Snail, days );

}

function init( wellHeight, initialClimbDistance, nightlySlideDistance, fatigue )
{

    const snail = {

        // unique snail id
        _id: new Mongo.ObjectId(),

        // private! current position of snail
        _position: 0,

        // public _position getter
        get position(){
            return this._position;
        },

        // public _position setter
        set position(x){

            // snail cannot go lower than 0
            if( x < 0 )
            {
                // physically impossible to go below zero
                x = 0;

                // snail is not 'fatigued' until the slide puts a snail LOWER than 0 (rule derived from tests)
                this.isFatigued = true;
            }

            // the snail is out of the well
            // examples showed a final height greater than the well, so apparently this is a levitating snail
            // todo: why is a levitating snail climbing? check maximum height of snail levitation
            // non-levitating snails don't count (height MUST exceed well height)
            else if ( x > this._config.target )
            {
                // mark the levitating snail as out of well.
                this.isOutOfWell = true;
            }

            // set position value
            this._position = x;
        },

        // snail config won't change after initialization
        _config: {

            // the height this snail needs to climb
            target: wellHeight,

            // The number of feet the snail will climb on the first day
            initialMoves: initialClimbDistance,

            // The number of feet the snail will slide at night
            nightlySlide: nightlySlideDistance,

            // The percentage of the initialMoves that fatigue will remove from each climb
            fatigue: fatigue

        },

        // Is the snail out of the well
        isOutOfWell: false,

        // Has the snail slid to the bottom of the well again?
        isFatigued: false,

        // calculates a climb including fatigue
        // triggers a position recording of the snail move
        climb: function( day ){
            let distance = this._config.initialMoves - ( this._config.initialMoves * (this._config.fatigue/100) * ( day.day - 1 ));
            this.position += (distance < 0 ? 0 : distance);
            day.track(this);
        },

        // calculates a slide
        // triggers a position recording of the snail move
        slide: function( day ){
            this.position -= this._config.nightlySlide;
            day.track(this);
        },

        // creates a shallow copy of the snail and returns only the state values
        log: function(){
            let copy = Object.assign({}, this);
            delete copy._position;
            delete copy._config;
            return copy;
        }
    };

    return doClimb( snail );

}

function log(days) {

    // last day always holds the result of the entire climb
    let lastDay = days[ days.length - 1];

    return Mongo.connect().then((db) => {

        // create the climb result based on the last day
        const results = {
            climb: {

                _id: lastDay.Snail._id,
                timestamp: lastDay.timestamp,
                h: lastDay.Snail._config.target,
                u: lastDay.Snail._config.initialMoves,
                d: lastDay.Snail._config.nightlySlide,
                f: lastDay.Snail._config.fatigue,
                result: `${lastDay.result} in ${lastDay.day} days`

            }
        };

        // save the climb results then save each day stats
        db.collection('climbs').insertOne(results.climb).then(()=>{

            days.forEach(day=>{

                let heightAfterSliding = null;

                // initial position
                let firstMove = day.moves.shift();
                let initialHeight = firstMove.position;

                // after climb
                let afterClimb = day.moves.shift();
                let distanceClimbed = afterClimb.position - initialHeight;
                let heightAfterClimbing = afterClimb.position;

                // after slide
                if(day.moves.length){
                    let afterSlide = day.moves.shift();
                    heightAfterSliding = afterSlide.position;
                }

                db.collection('days').insertOne({
                    climb: day.Snail._id,
                    day: day.day,
                    initialHeight: initialHeight,
                    distanceClimbed: distanceClimbed,
                    heightAfterClimbing: heightAfterClimbing,
                    heightAfterSliding: heightAfterSliding,
                    result: day.result
                });

            });

        });

        // return the calculated climb results
        return results;

    }).catch((err)=>{
        console.log(err);
        throw err;
    });

}

function findAllClimbs(){

    // get all of the climbs
    return Mongo.connect().then((db) => {
        return db.collection('climbs').find({});
    });

}

function findAllMovesByClimb(climbId){

    // get all of the days in a single climb
    return Mongo.connect().then((db) => {
        return db.collection('days').find({ climb : new Mongo.ObjectId(climbId) });
    });

}

module.exports = {
    init: init,
    log: log,
    findAllClimbs: findAllClimbs,
    findAllMovesByClimb: findAllMovesByClimb
};