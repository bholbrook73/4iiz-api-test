'use strict';

const PORT = process.env.PORT || 10010;

const SwaggerExpress = require('swagger-express-mw');
const SwaggerUi = require('swagger-tools/middleware/swagger-ui');
const app = require('express')();

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

    // add listener
    app.listen(PORT);

    if (swaggerExpress.runner.swagger.paths['/hello']) {
        console.log(`\nSwagger Express App Running on http://127.0.0.1:${PORT}/`);
    }
});

// for testing
module.exports = app;