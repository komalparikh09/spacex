const Router = require('express').Router;
const mongodb = require('mongodb');
const db = require('../db');
const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of launches
router.get('/', (req, res, next) => {
    const queryPage = req.query.page;
    const pageSize = 1;
    // let resultLaunches = [...launches];
    // if (queryPage) {
    //   resultLaunches = launches.slice(
    //     (queryPage - 1) * pageSize,
    //     queryPage * pageSize
    //   );
    // }
    const launches = [];
    db.getDb()
        .db()
        .collection('launches')
        .find()
        // .sort({_id: -1 })
        // .skip((queryPage - 1) * pageSize)
        // .limit(pageSize)
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
});

// Get a single launch
router.get('/:id', (req, res, next) => {
    db.getDb()
        .db()
        .collection('launches')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(launchDoc => {
            res.status(200).json(launchDoc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Confirms a launch and generate a unique launch ID
// Requires logged in user
router.post('', (req, res, next) => {
    const newLaunch = req.body;
    db.getDb()
        .db()
        .collection('launches')
        .insertOne(newLaunch)
        .then(result => {
            console.log(result);
            res
                .status(201)
                // .json({ message: 'Launch confirmed. Launch ID: ', launchId: result.insertedId });
                .json({ message: 'Launch confirmed. Launch ID: ' + result.insertedId });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Edit an existing launch
// Requires logged in user
router.patch('/:id', (req, res, next) => {
    const updatedLaunch = req.body;
    db.getDb()
        .db()
        .collection('launches')
        .updateOne(
            { _id: req.params._id },
            {
                $set: updatedLaunch
            }
        )
        .then(result => {
            res
                .status(200)
                // .json({ message: 'Launch details updated successfully: ', launchId: req.params._id });
                .json({ message: 'Launch details updated successfully for Launch ID: ' + req.params._id });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Delete a launch
// Requires logged in user
router.delete('/:id', (req, res, next) => {
    db.getDb()
        .db()
        .collection('launches')
        .deleteOne({ _id: new ObjectId(req.params._id) })
        .then(result => {
            res.status(200).json({ message: 'Launch has been closed' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

// Get multiple launches based on specialization and availability
router.get('/:launch_year, /:launch_success, /:launch_landing', (req, res, next) => {
    db.getDb()
        .db()
        .collection('launches')
        .find({ $and: [{ $text: { $search: new String(req.params.launch_year.replace(",", "")) } }, { $text: { $search: new String(req.params.launch_success.replace(",", "")) } }, { $text: { $search: new String(req.params.launch_landing.replace(",", "")) } }] })
        .then(launchDoc => {
            res.status(200).json(launchDoc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'An error occurred.' });
        });
});

module.exports = router;