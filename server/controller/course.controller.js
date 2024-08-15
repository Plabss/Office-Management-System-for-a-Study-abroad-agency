const Course = require("../model/Course.model");
const Student = require("../model/Student.model");
const { getACourse } = require("../services/course.service");

exports.addCourseController = async (req, res) => {
  try {
    console.log("Adding course and updating student");

    // Destructure course data from the request body
    const { name, level, university, country, applied, details, studentId } = req.body;

    // Create a new course instance
    const newCourse = new Course({
      name,
      level,
      university,
      country,
      applied,
      details,
      student: studentId, // Reference to the student
    });

    // Save the new course to the database
    const savedCourse = await newCourse.save();

    // Update the student's courses array with the new course ID
    await Student.findByIdAndUpdate(studentId, {
      $push: { courses: savedCourse._id },
    });

    // Optionally, you can fetch the updated student data if needed
    const updatedStudent = await Student.findById(studentId).populate('courses');

    // Respond with the saved course and updated student data
    res.status(201).json({ savedCourse, updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add course', error });
  }
};
exports.getACourseController = async (req, res) => {
    const { courseID } = req.params;
    console.log("bbbbbbbbbbbbbbbbbbbbbb",courseID);
    try {
      const course = await getACourse(courseID);
      console.log("course", course)
      res.status(200).json(course);
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ error: 'Failed to fetch student' });
    }
};
