const express = require('express');
const router = express.Router();

const {getSheets, getSheet, addSheet, updateSheet, deleteSheet} = require("../services/sheets.service");

// GET sheets
router.get('/', getSheets);

// POST add sheet
router.post('/', addSheet);

// GET sheet
router.get('/:id', getSheet);

// PUT modify sheet
router.put('/:id', updateSheet);

// DELETE remove sheet
router.delete('/:id', deleteSheet);

module.exports = router;
