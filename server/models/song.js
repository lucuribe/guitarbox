const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  id: {type: Number, required: true},
  title: {type: String, required: true},
  bpm: {type: Number, required: true},
  album_id: {type: String, required: true}
});

module.exports = mongoose.model('Song', songSchema);
