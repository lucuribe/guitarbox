require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('gb:app');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const songsRouter = require('./routes/songs');

const app = express();
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD +
  "@cluster0.j8z3wlp.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority")
  .then(() => {
    debug("Connected to database");
  })
  .catch(err => {
    debug("Connected failed", err);
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/songs', songsRouter);

module.exports = app;
