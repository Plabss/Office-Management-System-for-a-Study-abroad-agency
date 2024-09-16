const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee",required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student",required: false },
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor",required: false },
  for: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
