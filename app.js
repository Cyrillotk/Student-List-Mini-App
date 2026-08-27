const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.redirect("/students");
});
app.get("/students/new", (req, res) => {
  res.render("new-stud");
});

// READ ALL STUDENTS
app.get("/students", async (req, res) => {
  try {

    const students = await Student.find();

    res.render("stud-list", {
      students: students
    });

  } catch (error) {

    console.error("Error fetching students:", error);

    res.status(500).send("Error fetching students");

  }
});

// READ ONE STUDENT
app.get("/students/:id", async (req, res) => {
  try {

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.render("stud-detail", {
      student: student
    });

  } catch (error) {

    console.error("Error fetching student:", error);

    res.status(400).send("Invalid student ID");

  }
});

// CREATE STUDENT
app.post("/students", async (req, res) => {
  try {

    const { name, email, age, course } = req.body;

    if (!name || !email || !age || !course) {
      return res.status(400).send("All fields are required");
    }
    const student = new Student({
      name: name,
      email: email,
      age: age,
      course: course
    });

    await student.save();

    res.redirect("/students");

  } catch (error) {

    console.error("Error creating student:", error);

    res.status(500).send("Error creating student");

  }
});

// EDIT STUDENT 

app.get("/students/:id/edit", async (req, res) => {
  try {

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.render("student-edit", {
      student: student
    });

  } catch (error) {

    console.error("Error finding student:", error);

    res.status(400).send("Invalid student ID");

  }
});

// UPDATE STUDENT
app.post("/students/:id/edit", async (req, res) => {
  try {

    const { name, email, age, course } = req.body;

    if (!name || !email || !age || !course) {
      return res.status(400).send("All fields are required");
    }

    // Update the student
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        email: email,
        age: age,
        course: course
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Return to student list
    res.redirect("/students");

  } catch (error) {

    console.error("Error updating student:", error);

    res.status(400).send("Error updating student");

  }
});

// DELETE STUDENT

app.post("/students/:id/delete", async (req, res) => {
  try {

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Return to student list
    res.redirect("/students");

  } catch (error) {

    console.error("Error deleting student:", error);

    res.status(400).send("Error deleting student");

  }
});


app.use((req, res) => {
  res.status(404).send("Page not found");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});