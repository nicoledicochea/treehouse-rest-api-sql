const express = require("express");
const router = express.Router();
const User = require("../models").User;
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");

// get all users
router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "emailAddress"],
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
      } else {
        return res.sendStatus(401);
      }
      await User.create(req.body);
      res.location("/");
      res.sendStatus(201);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
