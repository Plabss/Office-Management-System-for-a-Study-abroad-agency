const cloudinary = require("../config/cloudinary");
const Employee = require("../model/Employee.model");
const Notification = require("../model/Notification.model");
const Student = require("../model/Student.model");
const Visitor = require("../model/Visitor.model");
const {
  addVisitor,
  getAllVisitors,
  getAVisitorById,
  assignVisitorToEmployee,
  addEmployeeToVisitorService,
  removeEmployeeFromVisitorService
} = require("../services/visitor.service");

const bcrypt = require('bcryptjs');

// exports.addVisitorController = async (req, res) => {
//   try {
//     console.log("stu", req.body);
//     console.log("stu", req.files["nidOrBirthCertificate"][0].path);
//     const { name, email, phone, interestedCountries, targetedIntake, employeeId } =
//       req.body;
//     const nidOrBirthCertificateUpload = await cloudinary.uploader.upload(
//       req.files["nidOrBirthCertificate"][0].path,
//       {
//         folder: "visitor/nidOrBirthCertificate",
//       }
//     );

//     const newVisitor = await addVisitor({
//       name,
//       email,
//       phone,
//       interestedCountries,
//       targetedIntake,
//       employeeId,
//       nidOrBirthCertificate: nidOrBirthCertificateUpload.secure_url,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Visitor Registration completed successfully",
//       data: newVisitor,
//     });

//     res.status(400).json({ ok:'success' });

//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getAllVisitorsController = async (req, res) => {
//   try {
//     const visitors = await getAllVisitors();
//     res.status(200).json(visitors);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
// exports.getAllVisitorsController = async (req, res) => {
//   try {
//     // Extract query parameters from request
//     const filters = {
//       name: req.query.name || '',
//       startDate: req.query.startDate || '',
//       endDate: req.query.endDate || '',
//     };

//     console.log(req.query)

//     // Fetch visitors with filters
//     const visitors = await getAllVisitors(filters);
//     res.status(200).json(visitors);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getAllVisitorsController = async (req, res) => {
//   try {
//     // Extract query parameters from request
//     const filters = {
//       name: req.query.name || "",
//       startDate: req.query.startDate || "",
//       endDate: req.query.endDate || "",
//       interestedCountry: req.query.interestedCountry || "", // Add interestedCountry filter
//     };

//     // Fetch visitors with filters
//     const visitors = await getAllVisitors(filters);
//     res.status(200).json(visitors);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.addVisitorController = async (req, res) => {
  try {
    const { name, email, phone, interestedCountries, targetedIntake, employeeId } = req.body;
    
    // Upload NID/Birth Certificate
    let nidOrBirthCertificateUpload = null;
    if (req.files && req.files["nidOrBirthCertificate"]) {
      nidOrBirthCertificateUpload = await cloudinary.uploader.upload(
        req.files["nidOrBirthCertificate"][0].path,
        {
          folder: "visitor/nidOrBirthCertificate",
        }
      );
    }

    // Add new visitor
    const newVisitor = await addVisitor({
      name,
      email,
      phone,
      interestedCountries,
      targetedIntake,
      nidOrBirthCertificate: nidOrBirthCertificateUpload ? nidOrBirthCertificateUpload.secure_url : null,
    });

    // If employeeId is provided, assign visitor to employee
    if (employeeId) {
      await assignVisitorToEmployee(newVisitor._id, employeeId);
    }

    if (newVisitor && employeeId) {
      const notification = new Notification({
        message: `A new student has been assigned to you for follow up: ${newVisitor.name}`,
        employeeId: employeeId,
        visitorId: newVisitor._id,
        for: "follow up",
      });
      await notification.save();

      const io = req.app.get("socketio");
      io.emit("notification", notification);
    }

    res.status(200).json({
      status: "success",
      message: "Visitor Registration completed successfully",
      data: newVisitor,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllVisitorsController = async (req, res) => {
  try {
    // Extract query parameters from request
    const filters = {
      name: req.query.name || "",
      startDate: req.query.startDate || "",
      endDate: req.query.endDate || "",
      interestedCountry: req.query.interestedCountry || "", // Add interestedCountry filter
    };

    const page = parseInt(req.query.page, 10) || 1; // Default page is 1
    const limit = parseInt(req.query.limit, 10) || 2; // Default limit is 10 visitors per page

    // Fetch visitors with filters and pagination
    const visitorsData = await getAllVisitors(filters, page, limit);
    res.status(200).json(visitorsData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllVisitorsWithoutPaginationController = async (req, res) => {
  try {
    const visitorsData = await Visitor.find({});
    res.status(200).json(visitorsData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAVisitorController = async (req, res) => {
  try {
    console.log("hitttttttttttttt");
    const visitor = await getAVisitorById(req.params.visitorId);
    res.status(200).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.convertVisitorToStudent = async (req, res) => {
  const session = await Student.startSession(); // Start a session for transaction
  session.startTransaction(); // Start transaction

  try {
    const { visitorId } = req.params;
    const { parentPhone, dob, address, counselor } = req.body;

    // Find the visitor by ID
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Visitor not found" });
    }

    // Generate a random six-digit password
    const randomPassword = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    console.log("r", randomPassword);

    // // Hash the password before saving it to the database
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Prepare student data for creation
    const studentData = {
      fullName: visitor.name,
      email: visitor.email,
      phoneNumber: visitor.phone,
      parentPhone,
      dob,
      address,
      employees: {
        asCounselor: [counselor], // Assign the selected counselor
      },
      password: randomPassword, // Save the hashed password
    };

    // Create a new student using the studentData
    const newStudent = new Student(studentData);
    await newStudent.save({ session }); // Save the student within the session

    // Update the employee document to add the new student to the counselor's list
    if (counselor) {
      await Employee.findByIdAndUpdate(
        counselor,
        { $addToSet: { "students.asCounselor": newStudent._id } },
        { session } // Ensure this update is part of the transaction
      );
    }

    // Commit the transaction after successful student creation and employee update
    await session.commitTransaction();
    session.endSession();

    // After creating the student, create a notification for the assigned counselor
    const notification = new Notification({
      message: `A new student has been assigned to you for counseling: ${newStudent.fullName}`,
      employeeId: newStudent.employees.asCounselor[0],
      studentId: newStudent._id,
      for: "counseling",
    });
    await notification.save();

    // Emit the notification using Socket.io
    const io = req.app.get("socketio");
    io.emit("notification", notification);

    // Remove the visitor after converting to a student
    await Visitor.findByIdAndDelete(visitorId);

    // Send the generated password back to the client (this could be emailed instead)
    res.status(201).json({
      message: "Visitor converted to student successfully",
      student: newStudent,
      password: randomPassword, // Send the plain password only for demonstration purposes
    });
  } catch (error) {
    // Only abort if the transaction has not been committed yet
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error("Error converting visitor to student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.addEmployeeToVisitor = async (req, res) => {
  const { visitorId } = req.params;
  const { employeeId } = req.body;

  console.log(req.body);

  try {
    const updatedVisitor = await addEmployeeToVisitorService(
      visitorId,
      employeeId,
    );
    res
      .status(200)
      .json({ message: "Employee added successfully", updatedVisitor });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Failed to add employee" });
  }
};

exports.removeEmployeeFromVisitor = async (req, res) => {
  const { visitorId } = req.params;
  const { employeeId } = req.body;

  try {
    const updatedVisitor = await removeEmployeeFromVisitorService(
      visitorId,
      employeeId,
    );
    res
      .status(200)
      .json({ message: "Employee removed successfully", updatedVisitor });
  } catch (error) {
    console.error("Error removing employee:", error);
    res.status(500).json({ error: "Failed to remove employee" });
  }
};


exports.addDiscussionController = async (req, res) => {
  try {
    console.log("disssssss", req.body);
    const { visitorId } = req.params; // Get the studentId from request parameters
    const { message, assignedBy } = req.body; // Extract message and assignedBy from the request body

    // Find the student by ID
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res
        .status(404)
        .json({ status: "fail", message: "Visitor not found" });
    }

    // Create the new discussion object
    const newDiscussion = {
      employee_name: assignedBy.name,
      message: message,
    };

    // Add the new discussion to the student's discussions array
    visitor.discussions.push(newDiscussion);

    // Save the updated student document
    await visitor.save();
    res.status(201).json({
      status: "success",
      data: newDiscussion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteDiscussionController = async (req, res) => {
  console.log("hitttt");
  try {
    const { visitorId, discussionId } = req.params;
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res
        .status(404)
        .json({ status: "fail", message: "Visitor not found" });
    }

    // Find the discussion
    const discussionIndex = visitor.discussions.findIndex(
      (discussion) => discussion._id.toString() === discussionId
    );

    if (discussionIndex === -1) {
      return res.status(403).json({
        status: "fail",
        message: "You can only delete your own discussions.",
      });
    }

    // Remove the discussion from the array
    visitor.discussions.splice(discussionIndex, 1);

    // Save the updated student document
    await visitor.save();

    // Send a success response
    res.status(200).json({
      status: "success",
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    // Send an error response
    res.status(400).json({ status: "fail", error: error.message });
  }
};
