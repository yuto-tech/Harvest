'use strict';
const path = require('path')
const express = require('express');
const router = express.Router();
const { where } = require('sequelize');
const multer  = require('multer');
const User = require('../models/user');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}.jpg`);
  }
});
const upload = multer({ storage: storage });


router.get('/', (req, res) => res.sendFile(path.join(__dirname, 'uploads')));	

router.post('/', upload.single('file'), (req, res, next) => {
  console.log('アップロードしたファイル名： ' + req.file.originalname);
  console.log('保存されたパス：' + req.file.path);
  console.log('保存されたファイル名： ' + req.file.filename);
  const userId = req.user.id;
  res.redirect(`/support/${userId}`);
});


module.exports = router;