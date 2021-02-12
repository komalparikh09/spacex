const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongodb = require('mongodb').MongoClient;

const launchRoutes = require('./routes/launches');
const searchlaunchRoutes = require('./routes/searchlaunches');

const db = require('./db');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ limit: '500kb' }));
app.use('/images', express.static(path.join('backend/images')));
app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/launches', launchRoutes);
app.use('/searchlaunches', searchlaunchRoutes);
console.log('nodeenv' + process.env.NODE_ENV);
db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(process.env.PORT || 3100);
  }
});