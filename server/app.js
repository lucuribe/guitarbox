require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const debug = require('debug')('gb:app');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const songsRouter = require('./routes/songs');
const artistsRouter = require('./routes/artists');
const genresRouter = require('./routes/genres');
const albumsRouter = require('./routes/albums');
const sheetsRouter = require('./routes/sheets');


const app = express();
mongoose.connect(process.env.DB_URI)
  .then(() => {
    debug("Connected to database");
  })
  .catch(err => {
    debug("Connected failed", err);
  });

  app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/songs', songsRouter);
app.use('/artists', artistsRouter);
app.use('/genres',genresRouter);
app.use('/albums',albumsRouter);
app.use('/sheets',sheetsRouter);


module.exports = app;

