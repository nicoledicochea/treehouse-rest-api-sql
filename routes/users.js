const express = require("express");
const router = express.Router();
const User = require("../models").User;
const bcrypt = require('bcrypt');
const asyncHandler = require('../middleware/asyncHandler')

// handler function
// function asyncHandler(cb) {
//   return async (req, res, next) => {
//     try {
//       await cb(req, res, next);
//     } catch (error) {
//       // Forward error to the global error handler
//       next(error);
//     }
//   };
// }

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200);
    res.json(users);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    await User.create(req.body);
    res.location('/')
    res.sendStatus(201)
    // res.json({ "message": "Account successfully created!" })
  })
);

module.exports = router;
