const express = require('express');
const { addCourseController,getACourseController } = require('../../controller/course.controller');
const router = express.Router();

router.post('/add-course', addCourseController);
router.get('/get-a-course/:courseID', getACourseController);

module.exports = router;
