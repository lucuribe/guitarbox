const express = require('express');
const router = express.Router();

const {getGenres, getGenre, addGenre, updateGenre} = require("../services/genres.service");

// GET genres
router.get('/', getGenres);

// POST add genre
router.post('/', addGenre);

// GET genre
router.get('/:id', getGenre);

// PUT modify genre
router.put('/:id', updateGenre);

module.exports = router;
