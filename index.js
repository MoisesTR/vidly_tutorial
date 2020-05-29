const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const logger = require('./startup/logger');

process.on('unhandledRejection', (ex) => {
    throw ex;
});

require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}...`);
});

module.exports = server;