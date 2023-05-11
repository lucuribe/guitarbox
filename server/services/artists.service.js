const artistModel = require('../models/artist');
const debug = require('debug')('gb:artists');

const getArtists = (req, res) => {
  artistModel.find()
    .then((documents) => {
      debug(documents);
      res.status(200).json({
        message: 'Artists fetched successfully',
        songs: documents
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Couldn't fetch artists",
        error: err.message
      });
    });
};

const getArtist = (req, res) => {
  artistModel.findOne({_id: req.params.id})
    .then((documents) => {
      debug(documents);
      res.status(200).json({
        message: 'Artist fetched successfully',
        songs: documents
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Couldn't fetch artist",
        error: err.message
      });
    });
};

const addArtist = (req, res) => {
  const artist = new artistModel({
    name: req.body.name
  });
  artist.save()
    .then(() => {
      res.status(201).json({
        message: 'Artist added successfully'
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Couldn't add artist",
        error: err.message
      });
    });
};

const updateArtist = (req, res) => {
  artistModel.updateOne({_id: req.params.id}, req.body)
    .then(result => {
      debug(result);
      res.status(200).json({
        message: "Artist updated successfully"
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Couldn't update artist",
        error: err.message
      });
    })
};

module.exports = { getArtists, getArtist, addArtist, updateArtist };
