const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  title: {type: String, required: true},
  bpm: {type: Number, required: true},
  album_id: {type: String, required: true}
});

module.exports = mongoose.model('Song', songSchema);
