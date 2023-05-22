const mongoose = require('mongoose');
const Album = require('./album'); // Ruta correcta al archivo "album.js"


const songSchema = mongoose.Schema({
  id: {type: Number, required: true},
  title: {type: String, required: true},
  bpm: {type: Number, required: true},
  album_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true}
});

module.exports = mongoose.model('Song', songSchema);
