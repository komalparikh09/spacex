const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongodb = require('mongodb').MongoClient;
const port = process.env.PORT || 3100;

const launchRoutes = require('./routes/launches');
const searchlaunchRoutes = require('./routes/searchlaunches');

const db = require('./db');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ limit: '500kb' }));
// app.use('/images', express.static(path.join('backend/images')));
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

app.use('/api/launches', launchRoutes);
app.use('/api/searchlaunches', searchlaunchRoutes);

// app.get("/", function(req, res) {
//   //when we get an http get request to the root/homepage
//   res.send("Hello World");
// });

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
 res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port || 3100);
  }
});