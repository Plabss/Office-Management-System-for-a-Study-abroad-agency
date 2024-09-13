const {
  createStudent,
  getAllStudentsByEmployeeID,
  getAllStudents,
  getAStudent,
  uploadDocument,
  addEmployeeToStudentService,
  removeEmployeeFromStudentService,
} = require("../services/student.service");
const cloudinary = require("../config/cloudinary");
const Notification = require("../model/Notification.model");
const Student = require("../model/Student.model");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

exports.updateStudentController = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.studentID, req.body, {
      new: true,
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student info', error: error.message });
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
  const { name, startDate, endDate, country } = req.query; // Extract country from query
  try {
    const students = await getAllStudentsByEmployeeID({ employeeID, name, startDate, endDate, country });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

exports.getAllStudentsController = async (req, res) => {
  try {
    const { name, startDate, endDate, country } = req.query; // Extract country from query
    const students = await getAllStudents({ name, startDate, endDate, country });
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
exports.uploadDocumentStudent = async (req, res) => {
  try {
    console.log("hittttttttttttttttttt"); // Debug log
    const { studentId } = req.params;
    const { documentName } = req.body; // 'cv' or 'nid'
    console.log("xxxxxxxxxxxxxxxx", studentId); // Debug log

    // Check if the authenticated student matches the studentId in the request
    if (req.student._id !== studentId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Upload the file to Cloudinary
    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `students/${documentName}`,
    });

    // Determine which document field to update based on `documentName`
    const updateField = {};
    if (documentName === 'cv') {
      updateField['documents.cv'] = fileUpload.secure_url;
    } else if (documentName === 'nid') {
      updateField['documents.nid'] = fileUpload.secure_url;
    } else {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    // Update the student document with the new file URL
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateField },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Document upload completed successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteDocumentController = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { documentName } = req.body; // Expecting 'cv' or 'nid'

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get the document URL from the student's documents
    const documentUrl = student.documents[documentName];
    if (!documentUrl) {
      return res.status(400).json({ message: "Document not found or already deleted" });
    }

    // Extract the public_id from the document URL
    const publicId = extractPublicIdFromUrl(documentUrl);
    console.log("publicId: " + publicId);
    // Delete the document from Cloudinary
    await cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Failed to delete file from Cloudinary:", error);
        return res.status(500).json({ message: "Failed to delete file from Cloudinary", error });
      }
    });

    // Update student document field to null
    student.documents[documentName] = null;
    await student.save();

    res.status(200).json({ message: "Document deleted successfully", student });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Failed to delete document", error });
  }
};

// Helper function to extract the public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>
  const urlParts = url.split('/');
  const versionIndex = urlParts.findIndex((part) => part.startsWith('v'));
  const publicIdWithExtension = urlParts.slice(versionIndex + 1).join('/'); // Join parts after version
  const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.')); // Remove the file extension
  return publicId;
};

exports.updateStudentProgressController = async (req, res) => {
  const { studentId } = req.params;
  const { progress } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(studentId, { progress }, { new: true });
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student progress:', error);
    res.status(500).json({ error: 'Failed to update student progress.' });
  }
};

// Controller to fetch all courses for a specific student
exports.getStudentCoursesController = async (req, res) => {
  const { studentId } = req.params // Get studentId from the route parameters

  try {
    // Find the student by ID and populate the courses array
    const student = await Student.findById(studentId).populate('courses')

    if (!student) {
      return res.status(404).json({ message: 'Student not found' }) // Return 404 if student is not found
    }

    res.status(200).json(student.courses) // Return the student's courses
  } catch (error) {
    console.error('Error fetching student courses:', error)
    res.status(500).json({ error: 'Failed to fetch student courses' }) // Return 500 if there's a server error
  }
}
// Controller to add an employee to a student's employee list
exports.addEmployeeToStudent = async (req, res) => {
  const { studentId } = req.params
  const { employeeId, role } = req.body;

  console.log(req.body)

  try {
    const updatedStudent = await addEmployeeToStudentService(studentId, employeeId, role);
    res.status(200).json({ message: 'Employee added successfully', updatedStudent });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

// Controller to remove an employee from a student's employee list
exports.removeEmployeeFromStudent = async (req, res) => {
  const { studentId } = req.params
  const { employeeId, role } = req.body;

  try {
    const updatedStudent = await removeEmployeeFromStudentService(studentId, employeeId, role);
    res.status(200).json({ message: 'Employee removed successfully', updatedStudent });
  } catch (error) {
    console.error('Error removing employee:', error);
    res.status(500).json({ error: 'Failed to remove employee' });
  }
};

exports.studentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: student._id, email: student.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Return token and student info
    res.json({ token, student });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getStudentDocuments = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Ensure the authenticated student matches the studentId in the request
    if (req.student._id !== studentId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ documents: student.documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a specific document for a student
exports.deleteStudentDocument = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { documentName } = req.body;

    // Ensure the authenticated student matches the studentId in the request
    if (req.student._id !== studentId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the document URL to delete from Cloudinary
    const documentUrl = student.documents[documentName];
    if (documentUrl) {
      // Delete from Cloudinary
      const publicId = documentUrl.split('/').slice(-2).join('/').split('.')[0]; // Extract the public ID from URL
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

      // Remove from the database
      student.documents[documentName] = null;
      await student.save();

      res.status(200).json({ message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


