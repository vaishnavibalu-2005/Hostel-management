const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// GET /api/students - list all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch students." });
  }
});

// POST /api/students - add a student
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.code === 11000 ? "Roll number already exists." : error.message });
  }
});

// PUT /api/students/:id - update a student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/students/:id - delete a student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
