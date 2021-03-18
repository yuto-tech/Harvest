"use strict";
const path = require("path");
const express = require("express");
const router = express.Router();
const authenticationEnsurer = require("./authentication-ensurer");
const uuid = require("uuid");
const multer = require("multer");
const Fanding = require("../models/fanding");
const Counter = require("../models/view-counter");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const titleID = uuid.v4();
    cb(null, `${titleID}.jpg`);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("uploaded_file"), (req, res, next) => {
  console.log("アップロードしたファイル名： " + req.file.originalname);
  console.log("保存されたパス：" + req.file.path);
  console.log("保存されたファイル名： " + req.file.filename);
  const titleID = req.file.filename.replace(".jpg", "");
  const updatedat = new Date();
  Fanding.create({
    titleID,
    title: req.body.title.slice(0, 56) || "（名称未設定）",
    image: `${titleID}.jpg`,
    sumview: req.body.sumview,
    giveweek: req.body.giveweek,
    explanation: req.body.explanation.slice(0, 1200),
    createdBy: req.user.id,
    updatedat,
  }).then(() => {
    const viewID = uuid.v4();
    Counter.create({
      viewID,
      userId: req.user.id,
      titleID,
    });
    res.redirect(`/output/${titleID}`);
  });
});

module.exports = router;
