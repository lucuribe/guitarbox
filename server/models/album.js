const mongoose = require('mongoose');
// adición 22/05
const Artist = require('./artist'); // Ruta correcta al archivo "artist.js"
const Genre = require('./genre'); // Ruta correcta al archivo "genre.js"

const albumSchema = mongoose.Schema({
  title: {type: String, required: true},
  releaseDate: {type: Date},
  artist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true}
});

module.exports = mongoose.model('Album', albumSchema);
