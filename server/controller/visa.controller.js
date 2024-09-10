const Visa = require('../model/Visa.model')
const cloudinary = require("../config/cloudinary");
const Student = require("../model/Student.model");
const { getAVisa,uploadVisaDocument } = require('../services/visa.service');


exports.addVisaController = async (req, res) => {
  try {
    console.log("Adding visa and updating student");

    // Destructure course data from the request body
    const { student, assignedBy, course } = req.body; // Also include course data

    console.log("Received data:", req.body);

    // Create a new visa instance
    const newVisa = new Visa({
      country: req.body.country,
      course: {
        courseId: course.courseId,
        courseName: course.courseName,
        courseUniversity: course.courseUniversity,
      },
      student: {
        _id: student._id, // Reference to the student
      },
      assignedBy: {
        name: assignedBy.name,
        _id: assignedBy._id, // Reference to the employee who assigned this
      },
    });

    console.log("newVisa", newVisa);

    // Save the new visa to the database
    const savedVisa = await newVisa.save();

    // Update the student's visas array with the new visa ID
    console.log("sttttttdId",student._id)
    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      {
        $addToSet: { visas: savedVisa._id }, // Use $addToSet to prevent duplicate entries
      },
      { new: true } // Return the updated document
    ).populate("visas");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Updated student", updatedStudent);

    // Respond with the saved visa and updated student data
    res.status(201).json({ savedVisa, updatedStudent });
  } catch (error) {
    console.error("Error while adding visa and updating student:", error);
    res.status(500).json({ message: "Failed to add visa", error: error.message });
  }
};

exports.getAVisaController = async (req, res) => {
  const { visaId } = req.params;
  console.log("bbbbbbbbbbbbbbbbbbbbbb", visaId);
  try {
    const visa = await getAVisa(visaId);
    console.log("visa", visa);
    res.status(200).json(visa);
  } catch (error) {
    console.error("Error fetching visa:", error);
    res.status(500).json({ error: "Failed to fetch visa" });
  }
};
exports.uploadADocumentController = async (req, res) => {
  try {
    console.log("bbbbbbbbbbbbbbbbbbbbbb", req.file);
    console.log("hittttttttttttttttttt");
    const { visaId } = req.params;
    const { documentName } = req.body;
    console.log("xxxxxxxxxxxxxxxx", visaId, documentName, req.file);

    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `visa/${documentName}`,
    });

    const uploadedDocument = await uploadVisaDocument(
      visaId,
      documentName,
      fileUpload.secure_url
    );

    res.status(200).json({
      status: "success",
      message: "Document upload completed successfully",
      data: uploadedDocument,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
