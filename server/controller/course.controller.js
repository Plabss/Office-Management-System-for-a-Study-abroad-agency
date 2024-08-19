const Course = require("../model/Course.model");
const cloudinary = require("../config/cloudinary");
const Student = require("../model/Student.model");
const {
  getACourse,
  uploadCourseDocument,
} = require("../services/course.service");

exports.addCourseController = async (req, res) => {
  try {
    console.log("Adding course and updating student");

    // Destructure course data from the request body
    const { name, level, university, country, studentId, assignedBy } =
      req.body;

    console.log(req.body);

    // Create a new course instance
    const newCourse = new Course({
      name,
      level,
      university,
      country,
      student: {
        _id: studentId, // Correctly reference the student ID
        // If you also have the student's name, you should include it here.
        // name: studentName
      },
      assignedBy: {
        name: assignedBy.name, // Correctly reference the assignedBy name
        _id: assignedBy._id, // Correctly reference the assignedBy ID
      },
    });

    // Save the new course to the database
    const savedCourse = await newCourse.save();

    // Update the student's courses array with the new course ID
    await Student.findByIdAndUpdate(studentId, {
      $push: { courses: savedCourse._id },
    });

    // Optionally, you can fetch the updated student data if needed
    const updatedStudent = await Student.findById(studentId).populate(
      "courses"
    );

    // Respond with the saved course and updated student data
    res.status(201).json({ savedCourse, updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Failed to add course", error });
  }
};
exports.getACourseController = async (req, res) => {
  const { courseId } = req.params;
  console.log("bbbbbbbbbbbbbbbbbbbbbb", courseId);
  try {
    const course = await getACourse(courseId);
    console.log("course", course);
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};
exports.uploadADocumentController = async (req, res) => {
  try {
    console.log("bbbbbbbbbbbbbbbbbbbbbb", req.file);
    console.log("hittttttttttttttttttt");
    const { courseId } = req.params;
    const { documentName } = req.body;
    console.log("xxxxxxxxxxxxxxxx", courseId, documentName, req.file);

    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `course/${documentName}`,
    });

    const uploadedDocument = await uploadCourseDocument(
      courseId,
      documentName,
      fileUpload.secure_url
    );

    res.status(200).json({
      status: "success",
      message: "Document upload completed successfully",
      data: uploadedDocument,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
