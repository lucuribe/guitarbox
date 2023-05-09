const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('GuitarBox 2023');
});

module.exports = router;
