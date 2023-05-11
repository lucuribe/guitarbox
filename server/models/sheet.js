const mongoose = require('mongoose');

const sheetSchema = mongoose.Schema({
  lyrics: {type: String, required: true},
  chords: {type: [String], required: true},
  instrument_id: {type: String, required: true},
  song_id: {type: String, required: true},
});

module.exports = mongoose.model('Sheet', sheetSchema);
