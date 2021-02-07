const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db');

const router = Router();

// Get multiple launches based on the filters selected
const launches = [];
router.get('/', (req, res, next) => {
    console.log(req.query);
    console.log(req.query.launch_year);
    console.log(req.query.launch_success);
    console.log(req.query.launch_landing);
    if (req.query.launch_year && req.query.launch_success && req.query.launch_landing) {
        db.getDb()
            .db()
            .collection('launches')
            .find({ $and: [{ "launch_year": { $in: req.query.launch_year } }, { "launch_success": { $in: req.query.launch_success } }, { "launch_landing": { $in: req.query.launch_landing } }] })
            .forEach(launchDoc => {
                launches.push(launchDoc);
            })
            .then(result => {
                res.status(200).json(launches);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: 'An error occurred.' });
            });
    }
});

module.exports = router;