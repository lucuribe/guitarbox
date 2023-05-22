const sheetModel = require('../models/sheet');
const debug = require('debug')('gb:sheets');

const getSheets = (req, res) => {
    sheetModel.find()
        .populate({
            path: 'song_id',
            populate: [
                {
                    path: 'album_id', populate: [
                        { path: 'artist_id' },
                        { path: 'genre_id' }
                    ]
                },
            ]
        })
        .then((documents) => {
            debug(documents);
            res.status(200).json({
                message: 'Sheets fetched successfully',
                sheets: documents
            });
        })
        .catch(err => {
            debug(err);
            res.status(400).json({
                message: "Couldn't fetch sheets",
                error: err.message
            });
        });
};

const getSheet = (req, res) => {
    sheetModel.findOne({ _id: req.params.id })
        .populate({
            path: 'song_id',
            populate: [
                {
                    path: 'album_id', populate: [
                        { path: 'artist_id' },
                        { path: 'genre_id' }
                    ]
                },
            ]
        })
        .then((documents) => {
            debug(documents);
            res.status(200).json({
                message: 'Sheet fetched successfully',
                sheets: documents
            });
        })
        .catch(err => {
            debug(err);
            res.status(400).json({
                message: "Couldn't fetch sheet",
                error: err.message
            });
        });
};

const addSheet = (req, res) => {
    const sheet = new sheetModel({
        title: req.body.title,
        bpm: req.body.bpm,
        album_id: req.body.album_id
    });
    sheet.save()
        .then(() => {
            res.status(201).json({
                message: 'Sheet added successfully'
            });
        })
        .catch(err => {
            debug(err);
            res.status(400).json({
                message: "Couldn't add sheet",
                error: err.message
            });
        });
};

const updateSheet = (req, res) => {
    sheetModel.updateOne({ _id: req.params.id }, req.body)
        .then(result => {
            debug(result);
            res.status(200).json({
                message: "Sheet updated successfully"
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Couldn't update sheet",
                error: err.message
            });
        })
};

const deleteSheet = (req, res) => {
    sheetModel.deleteOne({ _id: req.params.id })
        .then(result => {
            debug(result);
            res.status(200).json({
                message: "Sheet deleted successfully"
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Couldn't delete sheet",
                error: err.message
            });
        })
};

module.exports = {
    getSheets
    , getSheet, addSheet, updateSheet, deleteSheet
};
