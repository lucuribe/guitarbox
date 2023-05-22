const mongoose = require('mongoose');
const Song = require('./song'); // Ruta correcta al archivo "song.js"

const sheetSchema = mongoose.Schema({
  lyrics: {type: String, required: true},
  chords: {type: [String]},
  instrument_id: {type: String},
  song_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true},
});

module.exports = mongoose.model('Sheet', sheetSchema);
