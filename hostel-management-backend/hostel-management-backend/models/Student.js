const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, trim: true, unique: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true, enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
  roomNumber: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  feeStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
