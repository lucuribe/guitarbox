const mongoose = require('mongoose');

const instrumentSchema = mongoose.Schema({
  name: {type: String, required: true},
});

module.exports = mongoose.model('Instrument', instrumentSchema);
