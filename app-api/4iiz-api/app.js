'use strict';

const PORT = process.env.PORT || 10010;
const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require('swagger-tools/middleware/swagger-ui');
const app = require('express')();
const Mongo = require('./api/helpers/mongo');

let config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {

    if (err)
    {
        throw err;
    }

    // add swagger ui
    app.use(SwaggerUi(swaggerExpress.runner.swagger));

    // install middleware
    swaggerExpress.register(app);

    // make default destination the docs
    app.get('/', (req,res)=>{
        res.redirect('/docs/#/default');
    });

    start();

});

function start()
{
    Mongo.connect().then(db=>{

        console.log("Mongo Connection Successful");

        Promise.all([

            db.createCollection("days"),
            db.createCollection("climbs")

        ]).then(()=>{

            app.listen(PORT);
            console.log(`Listening on Port ${PORT}`);

        });

    }).catch(err=>{

        console.log("Database Not Ready for Connection, Waiting...");
        console.warn(err.message);
        setTimeout(start, 400);

    });


}


// for testing
module.exports = app;