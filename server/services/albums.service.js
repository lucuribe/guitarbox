const albumModel = require('../models/album');
const debug = require('debug')('gb:albums');

const getAlbums = (req, res) => {
    albumModel.find()
        .populate('artist_id')
        .populate('genre_id')
        .then((documents) => {
            debug(documents);
            res.status(200).json({
                message: 'Albums fetched successfully',
                albums: documents
            });
        })
        .catch(err => {
            debug(err);
            res.status(400).json({
                message: "Couldn't fetch albums",
                error: err.message
            });
        });
};

const getAlbum = (req, res) => {
    albumModel.findOne({ _id: req.params.id })
        .populate('artist_id')
        .populate('genre_id')
        .then((document) => {
            debug(document);
            res.status(200).json({
                message: 'Album fetched successfully',
                album: document
            });
        })
        .catch(err => {
            debug(err);
            res.status(400).json({
                message: "Couldn't fetch album",
                error: err.message
            });
        });
};

const addAlbum = (req, res) => {
    const album = new albumModel({
        name: req.body.name
    });
    album.save()
        .then(() => {
            res.status(201).json({
                message: 'Album added successfully'
            });
        })
        .catch(err => {
            debug(err);
            res.status(400).json({
                message: "Couldn't add album",
                error: err.message
            });
        });
};

const updateAlbum = (req, res) => {
    albumModel.updateOne({ _id: req.params.id }, req.body)
        .then(result => {
            debug(result);
            res.status(200).json({
                message: "Album updated successfully"
            });
        })
        .catch(err => {
            res.status(400).json({
                message: "Couldn't update album",
                error: err.message
            });
        })
};

module.exports = { getAlbums, getAlbum, addAlbum, updateAlbum };
