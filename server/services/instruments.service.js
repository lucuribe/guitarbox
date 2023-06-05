const instrumentModel = require("../models/instrument");
const getInstruments = (req, res) => {
  instrumentModel.find()
    .then((documents) => {
      res.status(200).json({
        message: 'Instruments fetched successfully',
        instruments: documents
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        message: "Couldn't fetch instruments",
        error: err.message
      });
    });
};

module.exports = { getInstruments };
