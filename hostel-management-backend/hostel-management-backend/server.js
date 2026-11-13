require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/students");

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hostel Management API is running" });
});
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
