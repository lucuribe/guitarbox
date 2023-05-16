const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  title: {type: String, required: true},
  releaseDate: {type: Date},
  artist_id: {type: String, required: true},
  genre_id: {type: String, required: true}
});

module.exports = mongoose.model('Album', albumSchema);
