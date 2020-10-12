'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const Fanding = require('../models/fanding');
const User = require('../models/user');


router.get('/Setting', authenticationEnsurer, (req, res, next) => {
  res.render('Setting', { user: req.user });
});

router.post('/', (req, res, next) => {
  const titleID = uuid.v4();
  const updatedat = new Date();
  Fanding.create({
    titleID,
    title: req.body.title.slice(0, 56) || '（名称未設定）',
    image: req.body.preview,
    sumview: req.body.sumview,
    giveweek: req.body.giveweek,
    send00: req.body.middlepreview,
    explanation: req.body.explanation.slice(0, 1200),
    createdBy: req.user.id,
    updatedat
  }).then(() => {
    res.redirect(`/output/${titleID}`);
  });
});





module.exports = router;