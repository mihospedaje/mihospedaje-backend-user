'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path');
const app = express();
const cors = require('cors');
const helmet = require('helmet');


const corsOptions = {
    exposedHeaders: ['X-Auth', 'X-Total-Pages', 'X-Current-Page', 'X-Next-Page', 'X-Prev-Page', 'X-Total-Records'],
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}


// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('dev'));


// Import routes
const healthcheck = require('./routes/healthcheck');
const user = require('./routes/user')(app);
const role = require('./routes/role')(app);
const favorite = require('./routes/favorite')(app);
const ldap = require('./routes/ldap')(app);

// Implement routes
app.use('/api/v1', healthcheck);
//app.use('/api/v1', user);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});

module.exports = {
    server
}