//require('dotenv').config();

const configs = {
    production: {
        SERVER_URI: 'https://warm-coast-29891.herokuapp.com/api',
    },
    development: {
        SERVER_URI: 'http://localhost:3100',
    },
};

// module.exports.config = configs[process.env.NODE_ENV];
module.exports.config = configs['production'];