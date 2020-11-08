'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Fanding = require('../models/fanding');
const User = require('../models/user');
const Counter = require('../models/view-counter');
const uuid = require('uuid');

router.post('/', authenticationEnsurer, (req,res,next) => {
  const viewID = uuid.v4();
  Counter.create({
    viewID,
    userId: req.user.id,
    titleID: req.body.hidden
  });
});


module.exports = router;