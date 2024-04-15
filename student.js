const mysql = require('mysql');
const express = require ('express');
const app = express();
const PORT = 3000;

// Create MySQL Connection
const dbb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'schoolmanagementsystem'
});

// Connect to MySQL
dbb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database!');

/// staff register
app.use(express.json());

// Create Student Academic Information
app.post('/student/academic-information', (req, res) => {
  const {
    StudentID,FranchiseID, Subject, Marks, Grade, ExaminationDate, Term, StaffID, Comments, 
    Attendance, MaxMarks, Rank, ResultStatus, HomeworkScores, AssignmentScores
  } = req.body;
  if (!StudentID || !FranchiseID || !Subject || !Marks || !Grade || !ExaminationDate || !Term || !StaffID) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  // Insert data into the database
  const sql = `INSERT INTO student_academicinformation (
    StudentID,FranchiseID, Subject, Marks, Grade, ExaminationDate, Term, StaffID, Comments, 
      Attendance, MaxMarks, Rank, ResultStatus, HomeworkScores, AssignmentScores
  ) VALUES (?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    StudentID,FranchiseID, Subject, Marks, Grade, ExaminationDate, Term, StaffID, Comments, 
    Attendance, MaxMarks, Rank, ResultStatus, HomeworkScores, AssignmentScores
  ];

  dbb.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting student academic information:', err);
      return res.status(500).json({ error: 'An error occurred while inserting student academic information' });
    }
    console.log('Student academic information inserted successfully');
    return res.status(200).json({ reasponse: "200" , success: "true",  message: 'Student academic information inserted successfully' });
  });
});


// Read All Student Academic Information
app.get('/student/academic-information-fetch', (req, res) => {
  const sql = 'SELECT * FROM student_academicinformation';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching student academic information:', err);
      return res.status(500).json({ error: 'An error occurred while fetching student academic information' });
    }
    console.log('Student academic information fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Student Academic Information
app.put('/student/academic-information-update/:id', (req, res) => {
  const academicInfo = req.body;
  const academicId = req.params.id;
  const sql = 'UPDATE student_academicinformation SET ? WHERE AcademicID = ?';
  dbb.query(sql, [academicInfo, academicId], (err, result) => {
    if (err) {
      console.error('Error updating student academic information:', err);
      return res.status(500).json({ error: 'An error occurred while updating student academic information' });
    }
    console.log('Student academic information updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true",  message: 'Student academic information updated successfully' });
  });
});


// Delete Student Academic Information
app.delete('/student/academic-information-delete/:id', (req, res) => {
  const academicId = req.params.id;
  const sql = 'DELETE FROM student_academicinformation WHERE AcademicID = ?';
  dbb.query(sql, academicId, (err, result) => {
    if (err) {
      console.error('Error deleting student academic information:', err);
      return res.status(500).json({ error: 'An error occurred while deleting student academic information' });
    }
    console.log('Student academic information deleted successfully');
    return res.status(200).json({ reasponse: "200" , success: "true",  message: 'Student academic information deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
})

// STUDENT event 
app.get('/student/fetch_events', (req, res) => {
  dbb.query('SELECT * FROM student_events', (err, results) => {
      if (err) {
          console.error('Error fetching student events:', err);
          res.status(500).send('Internal server error');
          return;
      }
      res.json(results);
  });
});