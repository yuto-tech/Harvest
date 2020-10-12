'use strict';
const express = require('express');
const Fanding = require('../models/fanding');
const authenticationEnsurer = require('./authentication-ensurer');
const User = require('../models/user')
const { where } = require('sequelize');
const router = express.Router();

router.get('/', (req, res, next) => {
  Fanding.findAll({
    include: [{
        model: User,
        required: true
      }],   
    attributes: ['title','titleID','updatedat','createdBy'],
    order: [['updatedat','DESC']]
  }).then((fands) => {
    res.render('index', {
      fands, user: req.user
    });
  });
});

router.get('/output/:titleID', (req, res, next) => {
  Fanding.findOne({
    where: {
      titleID:req.params.titleID
    },
    attributes: ['title','giveweek','sumview','explanation','titleID'],
  }).then((fands) => {
    res.render('output', {
      fands
    });
  });
});

router.get('/support', (req, res, next) => {
  if(req.user){
    User.findOne({
      where: {
        userId: 65909608
      }
    }),
    res.render(`/support/${userId}`);
  }else{
    res.render('login', { user: req.user });
  }
  
});

router.get('/support/:userId',(req, res, next) => {
  User.findOne({
    where: {
      userId:req.params.userId
    },
    attributes: ['userId','username'],
  }).then((users) => {
    res.render('support', { users });
  });

});


module.exports = router;
