const express = require("express");
const router = express.Router();
const Course = require("../models").Course;
const User = require("../models").User;
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/auth-user");
const auth = require("basic-auth");

// get all courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200);
    res.json(courses);
  })
);

// create a course
router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      await Course.create(req.body);
      res.location(`/${req.body.id}`);
      res.sendStatus(201);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// get a specific course
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    if (course) {
      res.status(200);
      res.json(course);
    } else {
      res.sendStatus(404);
    }
  })
);

// update a specific course
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const credentials = auth(req);
      const course = await Course.findByPk(req.params.id);
      const user = await User.findByPk(course.userId);
      if (credentials.name === user.emailAddress) {
        if (course) {
          await course.update(req.body);
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// delete a specific course
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const credentials = auth(req);
    const course = await Course.findByPk(req.params.id);
    const user = await User.findByPk(course.userId);
    if (credentials.name === user.emailAddress) {
      if (course) {
        await course.destroy();
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(403);
    }
  })
);

module.exports = router;
