'use strict';

const dotenv = require('dotenv');
const result = dotenv.config();
const utils = require('./app/api/utils.js');
// const fs = require('fs');

if (result.error) {
    console.log(result.error.message);
    process.exit(1);
}
//
const Hapi = require('hapi');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    //  tls: {
    //      key: fs.readFileSync('./private/webserver.key'),
    //     cert: fs.readFileSync('./private/webserver.crt')
    // }
});


require('./app/models/db');

async function init() {
    await server.register(require('inert'));
    await server.register(require('vision'));
    await server.register(require('hapi-auth-cookie'));
    await server.register(require('hapi-auth-jwt2'));

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false,
        allowAbsolutePaths:true,
        allowInsecureAccess: true

    });

    server.auth.strategy('standard', 'cookie', {
        password: process.env.cookie_password,
        cookie: process.env.cookie_name,
        isSecure: false,
        ttl: 24 * 60 * 60 * 1000,
        redirectTo: '/'
    });

    //jwt strategy
    server.auth.strategy('jwt', 'jwt', {
        key: 'secretpasswordnotrevealedtoanyone',
        validate: utils.validate,
        verifyOptions: { algorithms: ['HS256'] },
    });

    server.auth.default({
        mode: 'required',
        strategy: 'standard'
    });

    server.bind({
        cloudinaryCredentials: {}
    });

    server.route(require('./routes'));
    server.route(require('./routesapi'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
