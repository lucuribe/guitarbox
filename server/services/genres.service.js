const genreModel = require('../models/genre');
const debug = require('debug')('gb:genres');

const getGenres = (req, res) => {
    genreModel.find()
      .then((documents) => {
        debug(documents);
        res.status(200).json({
          message: 'Genres fetched successfully',
          genres: documents
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Couldn't fetch genres",
          error: err.message
        });
      });
  };

  const getGenre = (req, res) => {
    genreModel.findOne({_id: req.params.id})
      .then((documents) => {
        debug(documents);
        res.status(200).json({
          message: 'Genre fetched successfully',
          genres: documents
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Couldn't fetch genre",
          error: err.message
        });
      });
  };

  const addGenre = (req, res) => {
    const genre = new genreModel({
      name: req.body.name
    });
    genre.save()
      .then(() => {
        res.status(201).json({
          message: 'Genre added successfully'
        });
      })
      .catch(err => {
        debug(err);
        res.status(400).json({
          message: "Couldn't add genre",
          error: err.message
        });
      });
  };
  
  const updateGenre = (req, res) => {
    genreModel.updateOne({_id: req.params.id}, req.body)
      .then(result => {
        debug(result);
        res.status(200).json({
          message: "Genre updated successfully"
        });
      })
      .catch(err => {
        res.status(400).json({
          message: "Couldn't update genre",
          error: err.message
        });
      })
  };
  
  module.exports = { getGenres, getGenre, addGenre, updateGenre };
  