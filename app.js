const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));


let students = [
  { id: 1, name: 'Alice', course: 'Computer Science', year: 2 },
  { id: 2, name: 'Brian', course: 'Electrical Engineering', year: 3 },
  { id: 3, name: 'Cynthia', course: 'Civil Engineering', year: 1 },
];


let nextId = 4;

app.get('/', (req, res) => {
  res.redirect('/students');
});


app.get('/students', (req, res) => {
  res.render('stud-list', { students });
});

app.get('/students/new', (req, res) => {
  res.render('new-stud');
});

app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).send('Student not found.');
  }

  res.render('stud-detail', { student });
});

// handle the form submission and add a student
app.post('/students/new', (req, res) => {
  const { name, course, year } = req.body;

  //validation
  if (!name || !course || !year) {
    return res.status(400).send('Please fill in name, course and year.');
  }

  const newStudent = {
    id: nextId,
    name: name.trim(),
    course: course.trim(),
    year: Number(year),
  };

  students.push(newStudent);
  nextId += 1;

  res.redirect('/students');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});