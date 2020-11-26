'use strict';
const express = require('express');
const Fanding = require('../models/fanding');
const authenticationEnsurer = require('./authentication-ensurer');
const User = require('../models/user');
const Counter = require('../models/view-counter');
const { where } = require('sequelize');
const { count } = require('../models/view-counter');
const router = express.Router();

router.get('/', (req, res, next) => {
  Fanding.findAll({
    include: [{
        model: User,
        required: true, 
     }], 
    attributes: ['title','titleID','updatedat','createdBy'],
    order: [['updatedat','DESC']]
  }).then((fands) => {
    Counter.findAll({
      raw: true,
      attributes: [
        'titleID',
        [Counter.sequelize.fn('count', Counter.sequelize.col('titleID')), 'countName']
      ],
      group:'titleID'
    }).then((counts)=>{
      console.log(counts);
      res.render('index', {fands,counts});
    });
  });
});

router.get('/output/:titleID', authenticationEnsurer, (req, res, next) => {
  Fanding.findOne({
    include: [{
      model: User,
      required: true,
    }], 
    where: {
      titleID:req.params.titleID
    }
  }).then((fands)=>{
      Counter.findAll({
        raw: true,
        attributes: [
          'titleID',
          [Counter.sequelize.fn('count', Counter.sequelize.col('titleID')), 'countName']
        ],
        where:{
          titleID:req.params.titleID
        },
        group:'titleID'
      }).then((counts)=>{
        console.log(counts[0].titleID);
        res.render('output', {fands,counts});
      });
  });
});


router.get('/support', (req, res, next) => {
  if(req.user){
    const userId = req.user.id;
    res.redirect(`/support/${userId}`);
  }else{
    res.render('login', { user: req.user });
  }
});

router.get('/support/:userId',(req, res, next) => {
  User.findOne({
    where: {
      userId:req.params.userId
    },
    attributes: ['userId','username','image_name'],
  }).then((users) => {
      Counter.findAll({
        include: [{
          model: Fanding,
          required: true,
          include: [{
            model: User,
            required: true,
          }],
        }],
        raw: true,
        where:{
          userId:req.params.userId
        },
    }).then((counts)=>{
      Counter.findAll({
        raw: true,
        attributes: [
          'titleID',
          [Counter.sequelize.fn('count', Counter.sequelize.col('titleID')), 'countName']
        ],
        group:'titleID'
      }).then((fands) =>{
        console.log(counts[0]["fand.title"]);
          res.render('support', { users,counts,fands });
        });
    });
  });
});

router.get('/Setting', authenticationEnsurer, (req, res, next) => {
  User.findOne({
    where: {
      userId:req.user.id
    },
    attributes: ['userId','username','image_name'],
  }).then((users) => {
    res.render('Setting', { users});
  });
});

module.exports = router;
