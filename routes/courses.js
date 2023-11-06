const express = require("express");
const router = express.Router();
const Course = require("../models").Course;
const User = require("../models").User;
const asyncHandler = require('../middleware/asyncHandler')
const { authenticateUser } = require('../middleware/auth-user')

// get all courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "user",
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
    await Course.create(req.body);
    res.sendStatus(201);
  })
);

// get a specific course
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });
    res.status(200);
    res.json(course);
  })
);

// update a specific course
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res.status(204).send();
  })
);

// delete a specific course
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).send();
  })
);

module.exports = router;
