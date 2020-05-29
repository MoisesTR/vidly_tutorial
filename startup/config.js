const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        console.log('An error has been ocurred');
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined'); 
    }
}