'use strict';

const uuid = require('uuid/v4');

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

        id: uuid(),

        day: days.length + 1,

        moves: [],

        /**
         * @var result enum <Success,Failed>
         */
        result: false,

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

        id: uuid(),

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

module.exports = {
    init: init
};