const express = require('express');
const router = express.Router();

const {getSongs, getSong, addSong, updateSong, deleteSong} = require("../services/songs.service");

// GET songs
router.get('/', getSongs);

// POST add song
router.post('/', addSong);

// GET song
router.get('/:id', getSong);

// PUT modify song
router.put('/:id', updateSong);

// DELETE remove song
router.delete('/:id', deleteSong);

module.exports = router;
