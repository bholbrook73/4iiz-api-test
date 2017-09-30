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

        _id: new Mongo.ObjectId(),

        Snail: Snail,

        timestamp: Date.now(),

        day: days.length + 1,

        moves: [],

        /**
         * @var result enum <Success,Failed>
         */
        result: null,

        track: function(Snail){
            this.moves.push(Snail.log());
        }

    };

    day.track(Snail);

    Snail.climb( days.length );

    day.track(Snail);

    if(!Snail.isOutOfWell)
    {
        Snail.slide();

        day.track(Snail);

        if(Snail.isFatigued)
        {
            day.result = 'Failed'
        }
    }
    else
    {
        day.result = 'Success';
    }

    days.push(day);

    return day.result ? days : doClimb( Snail, days );

}

function init( wellHeight, initialClimbDistance, nightlySlideDistance, fatigue )
{
    const snail = {

        _id: new Mongo.ObjectId(),

        /**
         * @var position number
         * The current position of the snail in the well
         */
        _position: 0,

        get position(){
            return this._position;
        },

        set position(x){

            if( x < 0 )
            {
                x = 0;
                this.isFatigued = true;
            }
            else if ( x > this._config.target )
            {
                this.isOutOfWell = true;
            }

            this._position = x;
        },


        _config: {

            target: wellHeight,

            /**
             * @var initialMoves number
             * The number of feet the snail will climb on the first day
             */
            initialMoves: initialClimbDistance,

            /**
             * @var nightlySlide number
             * The number of feet the snail will slide at night
             */
            nightlySlide: nightlySlideDistance,

            /**
             * @var fatigue number
             * The percentage of the initialMoves that fatigue will remove from each climb
             */
            fatigue: fatigue

        },

        /**
         * @var isOutOfWell boolean
         * Is the snail out of the well
         */
        isOutOfWell: false,

        /**
         * @var isFatigued boolean
         * Has the snail slid to the bottom of the well again?
         */
        isFatigued: false,

        climb: function(day=0){
            let distance = this._config.initialMoves - ( this._config.initialMoves * (this._config.fatigue/100) * day );
            this.position += (distance < 0 ? 0 : distance);
        },

        slide: function(){
            this.position -= this._config.nightlySlide;
        },

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

    let lastDay = days[ days.length - 1];

    return Mongo.connect().then((db) => {

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

        return results;

    }).catch((err)=>{
        console.log(err);
        throw err;
    });

}

function findAllClimbs(){

    return Mongo.connect().then((db) => {
        return db.collection('climbs').find({});
    });

}

function findAllMovesByClimb(climbId){

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