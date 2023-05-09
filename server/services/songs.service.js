const songModel = require('../models/song');
const debug = require('debug')('gb:songs');

const getSongs = (req, res) => {
  songModel.find()
    .then((documents) => {
      debug(documents);
      res.status(200).json({
        message: 'Songs fetched successfully',
        songs: documents
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Couldn't fetch songs",
        error: err.message
      });
    });
};

const getSong = (req, res) => {
  songModel.findOne({_id: req.params.id})
    .then((documents) => {
      debug(documents);
      res.status(200).json({
        message: 'Song fetched successfully',
        songs: documents
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Couldn't fetch song",
        error: err.message
      });
    });
};

const addSong = (req, res) => {
  const song = new songModel({
    title: req.body.title,
    bpm: req.body.bpm,
    album_id: req.body.album_id
  });
  song.save()
    .then(() => {
      res.status(201).json({
        message: 'Song added successfully'
      });
    })
    .catch(err => {
      debug(err);
      res.status(400).json({
        message: "Couldn't add song",
        error: err.message
      });
    });
};

const updateSong = (req, res) => {
  songModel.updateOne({_id: req.params.id}, req.body)
    .then(result => {
      debug(result);
      res.status(200).json({
        message: "Song updated successfully"
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Couldn't update song",
        error: err.message
      });
    })
};

const deleteSong = (req, res) => {
  songModel.deleteOne({_id: req.params.id})
    .then(result => {
      debug(result);
      res.status(200).json({
        message: "Song deleted successfully"
      });
    })
    .catch(err => {
      res.status(400).json({
        message: "Couldn't delete song",
        error: err.message
      });
    })
};

module.exports = { getSongs, getSong, addSong, updateSong, deleteSong };
