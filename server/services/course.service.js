const Course = require("../model/Course.model");
exports.getACourse = async (courseID) => {
  try {
    // Find the student by ID and populate the courses array with course details
    const course = await Course.findById(courseID);
    return course;
  } catch (error) {
    console.error("Error in getACourse service:", error);
    throw error;
  }
};


