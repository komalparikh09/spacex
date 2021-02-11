import { config } from 'dotenv/types';
import React from 'react';
require('dotenv').config();

const configs = {
    development: {
        SERVER_URI: 'http://localhost:3100',
    },
    production: {
        SERVER_URI: 'https://warm-coast-29891.herokuapp.com:3100',
    },
};

var config = configs[process.env.NODE_ENV];

export default config;