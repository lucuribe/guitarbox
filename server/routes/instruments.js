const express = require('express');
const router = express.Router();

const {getInstruments} = require("../services/instruments.service");

// GET instruments
router.get('/', getInstruments);

module.exports = router;
