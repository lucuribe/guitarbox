const express = require('express');
const router = express.Router();

const {getArtists, getArtist, addArtist, updateArtist} = require("../services/artists.service");

// GET artists
router.get('/', getArtists);

// POST add artist
router.post('/', addArtist);

// GET artist
router.get('/:id', getArtist);

// PUT modify artist
router.put('/:id', updateArtist);

module.exports = router;
