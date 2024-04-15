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



// Create Parent Registration
app.post('/parent-registration', (req, res) => {
  const { FatherName, MotherName, StudentID, FranchiseID, Work, Email, Phone, Address, RegistrationDate } = req.body;
  if (!FatherName || !MotherName || !StudentID || !FranchiseID || !Work || !Email || !Phone || !Address || !RegistrationDate) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  const sql = 'INSERT INTO parent_registration (FatherName, MotherName, StudentID, FranchiseID, Work, Email, Phone, Address, RegistrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  dbb.query(sql, [FatherName, MotherName, StudentID, FranchiseID, Work, Email, Phone, Address, RegistrationDate], (err, result) => {
    if (err) {
      console.error('Error registering parent:', err);
      return res.status(500).json({ error: 'An error occurred while registering parent' });
    }
    console.log('Parent registered successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Parent registered successfully' });
  });
});

// Get All Parent Registrations
app.get('/parent-registration-fetch', (req, res) => {
  const sql = 'SELECT * FROM parent_registration';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching parent registrations:', err);
      return res.status(500).json({ error: 'An error occurred while fetching parent registrations' });
    }
    console.log('Parent registrations fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Parent Registration
app.put('/parent-registration-update/:id', (req, res) => {
  const parentId = req.params.id;
  const { FatherName, MotherName, StudentID, FranchiseID, Work, Email, Phone, Address, RegistrationDate } = req.body;
  if (!FatherName || !MotherName || !StudentID || !FranchiseID || !Work || !Email || !Phone || !Address || !RegistrationDate) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  const sql = 'UPDATE parent_registration SET FatherName=?, MotherName=?, StudentID=?, FranchiseID=?, Work=?, Email=?, Phone=?, Address=?, RegistrationDate=? WHERE ParentID=?';
  dbb.query(sql, [FatherName, MotherName, StudentID, FranchiseID, Work, Email, Phone, Address, RegistrationDate, parentId], (err, result) => {
    if (err) {
      console.error('Error updating parent registration:', err);
      return res.status(500).json({ error: 'An error occurred while updating parent registration' });
    }
    console.log('Parent registration updated successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Parent registration updated successfully' });
  });
});

//   parent:--   get student information
//// student profile 
app.get('/get-students/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = `SELECT * FROM student_profile WHERE StudentID = ?`;
  dbb.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error('Error retrieving student profile:', err);
      return res.status(500).json({ error: 'An error occurred while retrieving student profile' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentProfile = result[0];
    console.log('Student profile retrieved successfully:', studentProfile);
    return res.status(200).json(studentProfile);
  });
});


//   parent:--   get student academic information
//// student academic information
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

// API endpoint to send a message from parent to teacher
app.post('/parent-teacher-communication', (req, res) => {
  const { ParentID, StaffID, Subject, Message, Attachment } = req.body;
  
  const sql = `INSERT INTO parent_teachercommunication (ParentID, StaffID, Subject, Message, Attachment) VALUES (?, ?, ?, ?, ?)`;
  const values = [ParentID, StaffID, Subject, Message, Attachment];

  dbb.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error sending message:', err);
      return res.status(500).json({ error: 'An error occurred while sending the message' });
    }
    console.log('Message sent successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Message sent successfully' });
  });
});

// API endpoint to fetch messages for a specific parent or teacher
app.get('/parent-teacher-communication-fetch/:id', (req, res) => {
  const CommunicationID = req.params.id;
  const sql = `SELECT * FROM Parent_TeacherCommunication WHERE ParentID = ? OR StaffID = ?`;
  
  dbb.query(sql, [CommunicationID, id], (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
    console.log('Messages fetched successfully');
    return res.status(200).json(results);
  });
});



/// parent get student event info
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
 

// PARENT - GET emergency alert and notification
app.get('/parent/emergency_notifications-fetch', (req, res) => {
  dbb.query('SELECT * FROM parent_emergency_notifications', (err, results) => {
      if (err) {
          console.error('Error fetching parent emergency notifications:', err);
          res.status(500).send('Internal server error');
          return;
      }
      res.json(results);
  });
});


// PARENT get student fees info
app.get('/student_fees/fetch', (req, res) => {
  dbb.query('SELECT * FROM student_fees', (err, results) => {
      if (err) {
          console.error('Error fetching student fees:', err);
          res.status(500).send('Internal server error');
          return;
      }
      res.json(results);
  });
});



///  create feedback for student 
// Insert Feedback API
app.post('/parent/student-feedback/create', (req, res) => {
  const {
    parentId,
    StudentID,
    FranchiseID,
    question,
    response,
    satisfaction_level,
    feedback_type,
    rating,
    feedback_comments,
    survey_date,
    feedback_status,
    responder_role,
    feedback_channel
  } = req.body;

  const sql = `INSERT INTO parent_feedback (
    parentId,
    StudentID,
    FranchiseID,
    question,
    response,
    satisfaction_level,
    feedback_type,
    rating,
    feedback_comments,
    survey_date,
    feedback_status,
    responder_role,
    feedback_channel
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [
    parentId,
    StudentID,
    FranchiseID,
    question,
    response,
    satisfaction_level,
    feedback_type,
    rating,
    feedback_comments,
    survey_date,
    feedback_status,
    responder_role,
    feedback_channel
  ];

  dbb.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ error: 'An error occurred while inserting feedback' });
    }
    console.log('Feedback inserted successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Feedback inserted successfully' });
  });
});






// PUT endpoint to update parent feedback
app.put('/parent/student-feedback/update/:feedbackId', (req, res) => {
  const feedbackId = req.params.feedbackId;
  const updatedFeedbackData = req.body;
  dbb.query('UPDATE parent_feedback SET ? WHERE feedback_id = ?', [updatedFeedbackData, feedbackId], (err, results) => {
      if (err) {
          console.error('Error updating parent feedback:', err);
          res.status(500).send('Internal server error');
          return;
      }
      res.send('Parent feedback updated successfully');
  });
});

// GET endpoint to retrieve all parent feedback
app.get('/parent/student_feedback/fetch', (req, res) => {
  dbb.query('SELECT * FROM parent_feedback', (err, results) => {
      if (err) {
          console.error('Error fetching parent feedback:', err);
          res.status(500).send('Internal server error');
          return;
      }
      res.json(results);
  });
});
















app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
})

