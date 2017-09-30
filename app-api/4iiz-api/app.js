'use strict';

const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require('swagger-tools/middleware/swagger-ui');
const app = require('express')();
const Mongo = require('./api/helpers/mongo');

// port the app will listen on
const PORT = process.env.PORT || 10010;

let config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {

    if (err)
    {
        // an error here should kill the container
        throw err;
    }

    // add swagger ui
    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);

    // redirect root the docs
    app.get('/', (req,res)=>{
        res.redirect('/docs/#/default');
    });

    // ready to start the application
    start();

});

function start()
{
    Mongo.connect().then(db=>{

        console.log("Mongo Connection Successful");

        // make sure our collections exist
        Promise.all([

            db.createCollection("days"),
            db.createCollection("climbs")

        ]).then(()=>{

            // only start the listener if we get a mongo connection
            app.listen(PORT);
            console.log(`Listening on Port ${PORT}`);

        });

    }).catch(err=>{

        // FAULT TOLERANCE
        // if the mongo database container isn't ready, don't kill the application
        // keep waiting for the database to come online
        console.log("Database Not Ready for Connection, Waiting...");

        // log the failure reason
        console.warn(err.message);

        // try again in 400ms
        setTimeout(start, 400);

    });


}

// for testing
module.exports = app;