const {
  createStudent,
  getAllStudentsByEmployeeID,
  getAllStudents,
  getAStudent,
  uploadDocument,
} = require("../services/student.service");
const cloudinary = require("../config/cloudinary");
const Notification = require("../model/Notification.model");
const Student = require("../model/Student.model");

exports.addStudentController = async (req, res) => {
  try {
    console.log("stu", req.body);
    const student = await createStudent(req.body);
    console.log(
      "stuuuuuuuuuuuuuu",
      student.employees.asCounselor[0],
      student._id
    );
    if (student) {
      const notification = new Notification({
        message: `A new student has been assigned to you for counseling: ${student.fullName}`,
        employeeId: student?.employees?.asCounselor[0],
        studentId: student._id,
        for: "counseling",
      });
      await notification.save();

      const io = req.app.get("socketio");
      io.emit("notification", notification);
    }
    res.status(201).json({
      status: "success",
      student,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.addDiscussionController = async (req, res) => {
  try {
    console.log("disssssss", req.body);
    const { studentId } = req.params; // Get the studentId from request parameters
    const { message, assignedBy } = req.body; // Extract message and assignedBy from the request body

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }

    // Create the new discussion object
    const newDiscussion = {
      employee_name: assignedBy.name,
      message: message,
    };

    // Add the new discussion to the student's discussions array
    student.discussions.push(newDiscussion);

    // Save the updated student document
    await student.save();
    res.status(201).json({
      status: "success",
      data: newDiscussion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteDiscussionController = async (req, res) => {
  console.log("hitttt")
  try {
    const { studentId, discussionId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }

    // Find the discussion
    const discussionIndex = student.discussions.findIndex(
      (discussion) => discussion._id.toString() === discussionId
    );

    if (discussionIndex === -1) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own discussions.',
      });
    }

    // Remove the discussion from the array
    student.discussions.splice(discussionIndex, 1);

    // Save the updated student document
    await student.save();

    // Send a success response
    res.status(200).json({
      status: 'success',
      message: 'Discussion deleted successfully',
    });
  } catch (error) {
    // Send an error response
    res.status(400).json({ status: 'fail', error: error.message });
  }
};
exports.getAllStudentsByEmployeeIdController = async (req, res) => {
  const { employeeID } = req.params;
  const { name, startDate, endDate } = req.query;
  try {
    const students = await getAllStudentsByEmployeeID({employeeID, name, startDate, endDate});
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
exports.getAllStudentsController = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.query;
    const students = await getAllStudents({ name, startDate, endDate });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
exports.getAStudentController = async (req, res) => {
  const { studentID } = req.params;
  try {
    const student = await getAStudent(studentID);
    res.status(200).json(student);
    console.log(studentID);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    console.log("hittttttttttttttttttt");
    const { studentId } = req.params;
    const { documentName } = req.body;
    console.log("xxxxxxxxxxxxxxxx", studentId);

    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `students/${documentName}`,
    });

    const uploadedDocument = await uploadDocument(
      studentId,
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
