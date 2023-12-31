const express = require("express");
const router = express.Router();
const User = require("../models").User;
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");
const auth = require("basic-auth");

// get all users
router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const credentials = auth(req);
    console.log(credentials)
    const users = await User.findOne({
      attributes: ["id", "firstName", "lastName", "emailAddress"],
      where: {
        emailAddress: credentials.name,
      },
    });
    res.status(200);
    res.json(users);
  })
);

// create a new user
router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      } 
      await User.create(req.body);
      res.location("/");
      res.status(201).send();
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
