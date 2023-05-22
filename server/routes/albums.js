const express = require('express');
const router = express.Router();

const {getAlbums, getAlbum, addAlbum, updateAlbum} = require("../services/albums.service");

// GET albums
router.get('/', getAlbums);

// POST add album
router.post('/', addAlbum);

// GET album
router.get('/:id', getAlbum);

// PUT modify album
router.put('/:id', updateAlbum);

module.exports = router;
