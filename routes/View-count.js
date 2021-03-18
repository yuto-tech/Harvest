"use strict";
const express = require("express");
const router = express.Router();
const authenticationEnsurer = require("./authentication-ensurer");
const Fanding = require("../models/fanding");
const User = require("../models/user");
const Counter = require("../models/view-counter");
const uuid = require("uuid");

router.post("/", (req, res, next) => {
  const viewID = uuid.v4();
  const titleID = req.body.hidden;
  Counter.create({
    viewID,
    userId: req.user.id,
    titleID,
  }).then(() => {
    setTimeout(function () {
      res.redirect(`output/${titleID}`);
    }, 3000);
  });
});

module.exports = router;
