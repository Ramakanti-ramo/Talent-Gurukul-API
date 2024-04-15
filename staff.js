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

// Create Staff Profile
app.post('/staff/profile/register', (req, res) => {
  const { FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position } = req.body;
  if (!FranchiseID || !FirstName || !LastName || !Gender || !Email || !Phone || !HireDate || !Position) {
    return res.status(400).json({ error: 'Please provide FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position' });
  }
  // Inserting user data into database
  const sql = 'INSERT INTO staff_profile (FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position) VALUES (?, ?, ?, ?, ? ,?, ?, ?)';
  dbb.query(sql, [FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'An error occurred while registering user' });
    }
    console.log('User registered successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'User registered successfully' });
  });
});




// app.post('/staff/profile/register', (req, res) => {
//   const { FirstName, LastName, Gender, Email, Phone, HireDate, Position } = req.body;
//   if (!FirstName || !LastName || !Gender || !Email || !Phone || !HireDate || !Position) {
//     return res.status(400).json({ error: 'Please provide FirstName, LastName, Gender, Email, Phone, HireDate, Position' });
//   }
//   // Fetching FranchiseID from centralfranchise table
//   const franchiseQuery = 'SELECT FranchiseID FROM centralfranchise'; // You may adjust this query as per your database schema
//   console.log(franchiseQuery);
//   dbb.query(franchiseQuery, (franchiseErr, franchiseResult) => {
//     if (franchiseErr) {
//       console.error('Error fetching FranchiseID:', franchiseErr);
//       return res.status(500).json({ error: 'An error occurred while fetching FranchiseID' });
//     }
//     const FranchiseID = franchiseResult.length > 0 ? franchiseResult[0].FranchiseID : null;
//     // Inserting user data into staff_attendance table
//     const insertQuery = 'INSERT INTO staff_profile (FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position) VALUES (?, ?, ?, ?, ? ,?, ?, ?)';
//     dbb.query(insertQuery, [FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position], (err, result) => {
//       if (err) {
//         console.error('Error registering user:', err);
//         return res.status(500).json({ error: 'An error occurred while registering user' });
//       }
//       console.log('User registered successfully');
//       return res.status(200).json({ response: "200", success: "true", message: 'User registered successfully' });
//     });
//   });
// });









// Delete Staff Profile



app.delete('/staff/profile/delete/:id', (req, res) => {
  const staffId = req.params.id;
  const sql = 'DELETE FROM staff_profile WHERE StaffID = ?';
  dbb.query(sql, [staffId], (err, result) => {
    if (err) {
      console.error('Error deleting staff:', err);
      return res.status(500).json({ error: 'An error occurred while deleting staff' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    console.log('Staff deleted successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Staff deleted successfully' });
  });
});



// Update Staff Profile
app.put('/staff/profile/update/:id', (req, res) => {
  const StaffID = req.params.id;
  const { FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position } = req.body;
  
  if (!FranchiseID || !FirstName || !LastName || !Gender || !Email || !Phone || !HireDate || !Position) {
    return res.status(400).json({ error: 'Please provide FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position' });
  }
  const sql = 'UPDATE staff_profile SET FranchiseID=?, FirstName=?, LastName=?, Gender=?, Email=?, Phone=?, HireDate=?, Position=? WHERE StaffID=?';
  dbb.query(sql, [FranchiseID, FirstName, LastName, Gender, Email, Phone, HireDate, Position, StaffID], (err, result) => {
    if (err) {
      console.error('Error updating staff:', err);
      return res.status(500).json({ error: 'An error occurred while updating staff' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    console.log('Staff updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true",message: 'Staff updated successfully' });
  });
});

// Get All Staff Profiles
app.get('/staff/profile/fetch', (req, res) => {
  const sql = 'SELECT * FROM staff_profile';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching staff profiles:', err);
      return res.status(500).json({ error: 'An error occurred while fetching staff profiles' });
    }
    console.log('Staff profiles fetched successfully');
    return res.status(200).json(results);
  });
});


// staff attendance insert
app.post('/staff/attendance/insert', (req, res) => {
  const { StaffID, FranchiseID , AttendanceDate, Status } = req.body;
  if (!StaffID || !FranchiseID  || !AttendanceDate || !Status) {
    return res.status(400).json({ error: 'Please provide StaffID, FranchiseID , AttendanceDate, and Status' });
  }
  const sql = 'INSERT INTO staff_attendance (StaffID, FranchiseID , AttendanceDate, Status) VALUES (?, ?, ?, ?)';
  dbb.query(sql, [StaffID, FranchiseID , AttendanceDate, Status], (err, result) => {
    if (err) {
      console.error('Error creating attendance record:', err);
      return res.status(500).json({ error: 'An error occurred while creating attendance record' });
    }
    console.log('Attendance record created successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Attendance record created successfully' });
  });
});


// Fetch staff Attendance Records
app.get('/staff/attendance/fetch/:id', (req, res) => {
  const StaffID = req.params.id; // Assuming the user's ID is part of the URL parameters
  const sql = 'SELECT * FROM staff_attendance WHERE StaffID = ?'; // Adjust the table name and condition accordingly
  dbb.query(sql, [StaffID], (err, results) => {
    if (err) {
      console.error('Error fetching details:', err);
      return res.status(500).json({ error: 'Fetching healthcare professional details failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User details not found' });
    }
   
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'fetch staff attendance records ' , results });
  });
});






// staff traning insert
app.post('/staff/training/insert', (req, res) => {
  const { StaffID, FranchiseID, TrainingName, TrainingStartDate, TrainingEndDate, CompletionStatus, Certification } = req.body;
  if (!StaffID || !FranchiseID  || !TrainingName || !TrainingStartDate  ||!TrainingEndDate  || !CompletionStatus  ||!Certification ) {
    return res.status(400).json({ error: 'Please provide StaffID, FranchiseID , TrainingName, TrainingDate, and CompletionStatus' });
  }
  const sql = 'INSERT INTO staff_trainingrecords ( StaffID, FranchiseID , TrainingName, TrainingStartDate, TrainingEndDate, CompletionStatus, Certification) VALUES (?, ?, ?, ?, ?, ?,?)';
  dbb.query(sql, [ StaffID, FranchiseID , TrainingName, TrainingStartDate, TrainingEndDate, CompletionStatus, Certification], (err, result) => {
    if (err) {
      console.error('Error creating training record:', err);
      return res.status(500).json({ error: 'An error occurred while creating training record' });
    }
    console.log('Training record created successfully');
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'Training record created successfully' });
  });
});

// Get All Training Records
app.get('/staff/training/fetch', (req, res) => {
  const sql = 'SELECT * FROM staff_trainingrecords';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching training records:', err);
      return res.status(500).json({ error: 'An error occurred while fetching training records' });
    }
    console.log('Training records fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Training Record
app.put('/staff/training/update/:id', (req, res) => {
  const recordId = req.params.id;
  const { StaffID,FranchiseID, TrainingName, TrainingStartDate, TrainingEndDate, CompletionStatus, Certification } = req.body;
  if (!StaffID || !FranchiseID || !TrainingName || !TrainingStartDate ||!TrainingEndDate  || !CompletionStatus) {
    return res.status(400).json({ error: 'Please provide StaffID, FranchiseID, TrainingName, TrainingDate, and CompletionStatus' });
  }
  const sql = 'UPDATE staff_trainingrecords SET StaffID=?, FranchiseID=?, TrainingName=?, TrainingStartDate=?,  TrainingEndDate=?, CompletionStatus=?, Certification=? WHERE RecordID=?';
  dbb.query(sql, [StaffID, FranchiseID, TrainingName, TrainingStartDate, TrainingEndDate, CompletionStatus, Certification, recordId], (err, result) => {
    if (err) {
      console.error('Error updating training record:', err);
      return res.status(500).json({ error: 'An error occurred while updating training record' });
    }
    console.log('Training record updated successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Training record updated successfully' });
  });
});

// Delete Training Record
app.delete('/staff/training/delete/:id', (req, res) => {
  const recordId = req.params.id;
  const sql = 'DELETE FROM staff_trainingrecords WHERE RecordID = ?';
  dbb.query(sql, [recordId], (err, result) => {
    if (err) {
      console.error('Error deleting training record:', err);
      return res.status(500).json({ error: 'An error occurred while deleting training record' });
    }
    console.log('Training record deleted successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Training record deleted successfully' });
  });
});


// staff study material insert
app.post('/staff/study-materials/insert', (req, res) => {
  const { CourseID,  StudentID, FranchiseID, MaterialName, MaterialType, MaterialURL } = req.body;
  if (!CourseID  || !StudentID  || !FranchiseID || !MaterialName || !MaterialType || !MaterialURL) {
    return res.status(400).json({ error: 'Please provide CourseID, StudentID,FranchiseID, MaterialName, MaterialType, and MaterialURL' });
  }
  const sql = 'INSERT INTO Staff_s_StudyMaterials (CourseID, StudentID,FranchiseID, MaterialName, MaterialType, MaterialURL) VALUES (?, ?, ?, ?, ?,?)';
  dbb.query(sql, [CourseID, StudentID, FranchiseID, MaterialName, MaterialType, MaterialURL], (err, result) => {
    if (err) {
      console.error('Error creating study material:', err);
      return res.status(500).json({ error: 'An error occurred while creating study material' });
    }
    console.log('Study material created successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Study material created successfully' });
  });
});



// Get All Study Materials
app.get('/staff/study-materials/fetch', (req, res) => {
  const sql = 'SELECT * FROM Staff_s_StudyMaterials';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching study materials:', err);
      return res.status(500).json({ error: 'An error occurred while fetching study materials' });
    }
    console.log('Study materials fetched successfully');
    return res.status(200).json(results);
  });
});



// staff student-exam marks
app.post('/staff/student/exam-marks', (req, res) => {
  const { StudentID, FranchiseID,CourseID, ExamName, Marks } = req.body;
  if (!StudentID || !FranchiseID || !CourseID || !ExamName || !Marks) {
    return res.status(400).json({ error: 'Please provide StudentID,FranchiseID, CourseID, ExamName, and Marks' });
  }
  const sql = 'INSERT INTO staff_s_exammarks (StudentID, FranchiseID,  CourseID, ExamName, Marks) VALUES (?, ?, ?, ? ,?)';
  dbb.query(sql, [StudentID, FranchiseID, CourseID, ExamName, Marks], (err, result) => {
    if (err) {
      console.error('Error creating exam mark:', err);
      return res.status(500).json({ error: 'An error occurred while creating exam mark' });
    }
    console.log('Exam mark created successfully');
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'Exam mark created successfully' });
  });
});

// Get All  Exam Marks -student
app.get('/staff/student/fetch-exam-marks', (req, res) => {
  const sql = 'SELECT * FROM staff_s_exammarks';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching exam marks:', err);
      return res.status(500).json({ error: 'An error occurred while fetching exam marks' });
    }
    console.log('Exam marks fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Exam Mark
app.put('/staff/student/update-exam-marks/:id', (req, res) => {
  const examMarkId = req.params.id;
  const { StudentID, FranchiseID, CourseID, ExamName, Marks } = req.body;
  if (!StudentID ||!FranchiseID 
     || !CourseID || !ExamName || !Marks) {
    return res.status(400).json({ error: 'Please provide StudentID, FranchiseID, CourseID, ExamName, and Marks' });
  }
  const sql = 'UPDATE staff_s_exammarks SET StudentID=?, FranchiseID=?, CourseID=?, ExamName=?, Marks=? WHERE ExamMarkID=?';
  dbb.query(sql, [StudentID, FranchiseID,CourseID, ExamName, Marks, examMarkId], (err, result) => {
    if (err) {
      console.error('Error updating exam mark:', err);
      return res.status(500).json({ error: 'An error occurred while updating exam mark' });
    }
    console.log('Exam mark updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Exam mark updated successfully' });
  });
});

// Delete Exam Mark
app.delete('/staff/student/delete-exam-marks/:id', (req, res) => {
  const examMarkId = req.params.id;
  const sql = 'DELETE FROM staff_s_exammarks WHERE ExamMarkID = ?';
  dbb.query(sql, [examMarkId], (err, result) => {
    if (err) {
      console.error('Error deleting exam mark:', err);
      return res.status(500).json({ error: 'An error occurred while deleting exam mark' });
    }
    console.log('Exam mark deleted successfully');
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'Exam mark deleted successfully' });
  });
});









// Create Meeting Schedule
app.post('/staff/meeting-schedules', (req, res) => {
  const { StaffID, FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, MeetingPurpose } = req.body;
  if (!StaffID ||!FranchiseID || !MeetingStartTime || !MeetingEndTime || !MeetingLocation || !MeetingPurpose) {
    return res.status(400).json({ error: 'Please provide StaffID,FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, and MeetingPurpose' });
  }
  const sql = 'INSERT INTO staff_meetingschedules (StaffID,FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, MeetingPurpose) VALUES (?, ?, ?, ?, ?, ?)';
  dbb.query(sql, [StaffID,FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, MeetingPurpose], (err, result) => {
    if (err) {
      console.error('Error creating meeting schedule:', err);
      return res.status(500).json({ error: 'An error occurred while creating meeting schedule' });
    }
    console.log('Meeting schedule created successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Meeting schedule created successfully' });
  });
});

// Get All Meeting Schedules
app.get('/staff/meeting-schedules-fetch', (req, res) => {
  const sql = 'SELECT * FROM staff_meetingschedules';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching meeting schedules:', err);
      return res.status(500).json({ error: 'An error occurred while fetching meeting schedules' });
    }
    console.log('Meeting schedules fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Meeting Schedule
app.put('/staff/meeting-schedules-update/:id', (req, res) => {
  const meetingId = req.params.id;
  const { StaffID, FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, MeetingPurpose } = req.body;
  if (!StaffID  || !FranchiseID || !MeetingStartTime || !MeetingEndTime || !MeetingLocation || !MeetingPurpose) {
    return res.status(400).json({ error: 'Please provide StaffID,FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, and MeetingPurpose' });
  }
  const sql = 'UPDATE staff_meetingschedules SET StaffID=?, FranchiseID=?, MeetingStartTime=?, MeetingEndTime=?, MeetingLocation=?, MeetingPurpose=? WHERE MeetingID=?';
  dbb.query(sql, [StaffID,FranchiseID, MeetingStartTime, MeetingEndTime, MeetingLocation, MeetingPurpose, meetingId], (err, result) => {
    if (err) {
      console.error('Error updating meeting schedule:', err);
      return res.status(500).json({ error: 'An error occurred while updating meeting schedule' });
    }
    console.log('Meeting schedule updated successfully');
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'Meeting schedule updated successfully' });
  });
});

// Delete Meeting Schedule
app.delete('/staff/meeting-schedules-delete/:id', (req, res) => {
  const meetingId = req.params.id;
  const sql = 'DELETE FROM staff_meetingschedules WHERE MeetingID = ?';
  dbb.query(sql, [meetingId], (err, result) => {
    if (err) {
      console.error('Error deleting meeting schedule:', err);
      return res.status(500).json({ error: 'An error occurred while deleting meeting schedule' });
    }
    console.log('Meeting schedule deleted successfully');
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'Meeting schedule deleted successfully' });
  });
});


// Create Class Assignment schedule
app.post('/staff/student-class-assignments', (req, res) => {
  const { StaffID, FranchiseID,Class, Subject, Course } = req.body;
  if (!StaffID  || !FranchiseID || !Class || !Subject || !Course) {
    return res.status(400).json({ error: 'Please provide StaffID,FranchiseID, Class, Subject, and Course' });
  }
  const sql = 'INSERT INTO staff_classassignments_schedules (StaffID, FranchiseID, Class, Subject, Course) VALUES (?, ?, ?, ?, ?)';
  dbb.query(sql, [StaffID, FranchiseID,Class, Subject, Course], (err, result) => {
    if (err) {
      console.error('Error creating class assignment:', err);
      return res.status(500).json({ error: 'An error occurred while creating class assignment' });
    }
    console.log('Class assignment created successfully');
    return res.status(200).json({reasponse: "200" , success: "true",   message: 'Class assignment created successfully' });
  });
});

// Get All Class Assignments
app.get('/staff/student-class-assignments/fetch', (req, res) => {
  const sql = 'SELECT * FROM staff_classassignments_schedules';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching class assignments:', err);
      return res.status(500).json({ error: 'An error occurred while fetching class assignments' });
    }
    console.log('Class assignments fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Class Assignment
app.put('/staff/student-class-assignments/update/:id', (req, res) => {
  const assignmentId = req.params.id;
  const { StaffID,FranchiseID, Class, Subject, Course } = req.body;
  if (!StaffID  ||!FranchiseID || !Class || !Subject || !Course) {
    return res.status(400).json({ error: 'Please provide StaffID,FranchiseID, Class, Subject, and Course' });
  }
  const sql = 'UPDATE staff_classassignments_schedules SET StaffID=?, FranchiseID=?, Class=?, Subject=?, Course=? WHERE AssignmentID=?';
  dbb.query(sql, [StaffID, FranchiseID,Class, Subject, Course, assignmentId], (err, result) => {
    if (err) {
      console.error('Error updating class assignment:', err);
      return res.status(500).json({ error: 'An error occurred while updating class assignment' });
    }
    console.log('Class assignment updated successfully');
    return res.status(200).json({reasponse: "200" , success: "true",   message: 'Class assignment updated successfully' });
  });
});

// Delete Class Assignment
app.delete('/staff/student-class-assignments/delete/:id', (req, res) => {
  const assignmentId = req.params.id;
  const sql = 'DELETE FROM staff_classassignments_schedules WHERE AssignmentID = ?';
  dbb.query(sql, [assignmentId], (err, result) => {
    if (err) {
      console.error('Error deleting class assignment:', err);
      return res.status(500).json({ error: 'An error occurred while deleting class assignment' });
    }
    console.log('Class assignment deleted successfully');
    return res.status(200).json({reasponse: "200" , success: "true",  message: 'Class assignment deleted successfully' });
  });
});


// Create staff Work Schedule
app.post('/staff/work-schedules', (req, res) => {
  const { StaffID, FranchiseID, Weekday, StartTime, EndTime } = req.body;
  if (!StaffID ||!FranchiseID || !Weekday || !StartTime || !EndTime) {
    return res.status(400).json({ error: 'Please provide StaffID,FranchiseID, Weekday, StartTime, and EndTime' });
  }
  const sql = 'INSERT INTO staff_workschedules (StaffID,FranchiseID, Weekday, StartTime, EndTime) VALUES (?, ?, ?, ?,?)';
  dbb.query(sql, [StaffID,FranchiseID, Weekday, StartTime, EndTime], (err, result) => {
    if (err) {
      console.error('Error creating work schedule:', err);
      return res.status(500).json({ error: 'An error occurred while creating work schedule' });
    }
    console.log('Work schedule created successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Work schedule created successfully' });
  });
});

// Get All Work Schedules
app.get('/staff/work-schedules-fetch', (req, res) => {
  const sql = 'SELECT * FROM staff_workschedules';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching work schedules:', err);
      return res.status(500).json({ error: 'An error occurred while fetching work schedules' });
    }
    console.log('Work schedules fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Work Schedule
app.put('/staff/work-schedules-update/:id', (req, res) => {
  const scheduleId = req.params.id;
  const { StaffID,FranchiseID, Weekday, StartTime, EndTime } = req.body;
  if (!StaffID ||!FranchiseID || !Weekday || !StartTime || !EndTime) {
    return res.status(400).json({ error: 'Please provide StaffID,FranchiseID, Weekday, StartTime, and EndTime' });
  }
  const sql = 'UPDATE staff_workschedules SET StaffID=?,FranchiseID=?, Weekday=?, StartTime=?, EndTime=? WHERE ScheduleID=?';
  dbb.query(sql, [StaffID,FranchiseID, Weekday, StartTime, EndTime, scheduleId], (err, result) => {
    if (err) {
      console.error('Error updating work schedule:', err);
      return res.status(500).json({ error: 'An error occurred while updating work schedule' });
    }
    console.log('Work schedule updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Work schedule updated successfully' });
  });
});

// Delete Work Schedule
app.delete('/staff/work-schedules-delete/:id', (req, res) => {
  const scheduleId = req.params.id;
  const sql = 'DELETE FROM staff_workschedules WHERE ScheduleID = ?';
  dbb.query(sql, [scheduleId], (err, result) => {
    if (err) {
      console.error('Error deleting work schedule:', err);
      return res.status(500).json({ error: 'An error occurred while deleting work schedule' });
    }
    console.log('Work schedule deleted successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Work schedule deleted successfully' });
  });
});


// Create Staff Report Card
app.post('/staff/report-cards', (req, res) => {
  const { StaffID,FranchiseID, Grade,  Experience, EvaluationDate } = req.body;
  if (!StaffID || !FranchiseID || !Grade || !Experience || !EvaluationDate) {
    return res.status(400).json({ error: 'Please provide StaffID, FranchiseID,,Grade,  Experience, and EvaluationDate' });
  }
  const sql = 'INSERT INTO staff_reportcards (StaffID,FranchiseID, Grade,  Experience, EvaluationDate) VALUES (?, ?, ?, ?, ?)';
  dbb.query(sql, [StaffID,FranchiseID, Grade,  Experience, EvaluationDate], (err, result) => {
    if (err) {
      console.error('Error creating staff report card:', err);
      return res.status(500).json({ error: 'An error occurred while creating staff report card' });
    }
    console.log('Staff report card created successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Staff report card created successfully' });
  });
});

// Get All Staff Report Cards
app.get('/staff/report-cards-fetch', (req, res) => {
  const sql = 'SELECT * FROM staff_reportcards';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching staff report cards:', err);
      return res.status(500).json({ error: 'An error occurred while fetching staff report cards' });
    }
    console.log('Staff report cards fetched successfully');
    return res.status(200).json(results);
  });
});

// Update Staff Report Card
app.put('/staff/report-cards-update/:id', (req, res) => {
  const reportCardId = req.params.id;
  const { StaffID, Grade, FranchiseID, Experience, EvaluationDate } = req.body;
  if (!StaffID || !Grade || !FranchiseID || !Experience || !EvaluationDate) {
    return res.status(400).json({ error: 'Please provide StaffID, Grade, FranchiseID, Experience, and EvaluationDate' });
  }
  const sql = 'UPDATE staff_reportcards SET StaffID=?, Grade=?, FranchiseID=?, Experience=?, EvaluationDate=? WHERE ReportCardID=?';
  dbb.query(sql, [StaffID, Grade, FranchiseID, Experience, EvaluationDate, reportCardId], (err, result) => {
    if (err) {
      console.error('Error updating staff report card:', err);
      return res.status(500).json({ error: 'An error occurred while updating staff report card' });
    }
    console.log('Staff report card updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true",  message: 'Staff report card updated successfully' });
  });
});


/// staff manage student
app.post('/staff/students-manage', (req, res) => {
  const { StudentID, StaffID, FranchiseID, FirstName, LastName, DateOfBirth, Gender, Email, Phone, Address } = req.body;
  
  // Check if all required fields are provided
  if (!StudentID || !StaffID || !FranchiseID || !FirstName || !LastName || !DateOfBirth || !Gender || !Email || !Phone || !Address) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  // Insert student data into the database
  const sql = 'INSERT INTO staff_manage_students (StudentID, StaffID, FranchiseID, FirstName, LastName, DateOfBirth, Gender, Email, Phone, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  dbb.query(sql, [StudentID, StaffID, FranchiseID, FirstName, LastName, DateOfBirth, Gender, Email, Phone, Address], (err, result) => {
    if (err) {
      console.error('Error inserting student data:', err);
      return res.status(500).json({ error: 'An error occurred while inserting student data' });
    }
    
    console.log('Student data inserted successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Student data inserted successfully' });
  });
});


// staff manage student - update
app.put('/staff/students-manage-update/:id', (req, res) => {
  const studentId = req.params.id;
  const { StaffID, FranchiseID, FirstName, LastName, DateOfBirth, Gender, Email, Phone, Address } = req.body;
  
  // Check if all required fields are provided
  if (!StaffID || !FranchiseID || !FirstName || !LastName || !DateOfBirth || !Gender || !Email || !Phone || !Address) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  const updateSql = 'UPDATE staff_manage_students SET StaffID=?, FranchiseID=?, FirstName=?, LastName=?, DateOfBirth=?, Gender=?, Email=?, Phone=?, Address=? WHERE StudentID=?';
  dbb.query(updateSql, [StaffID, FranchiseID, FirstName, LastName, DateOfBirth, Gender, Email, Phone, Address, studentId], (err, result) => {
    if (err) {
      console.error('Error updating student data:', err);
      return res.status(500).json({ error: 'An error occurred while updating student data' });
    }
    
    console.log('Student data updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Student data updated successfully' });
  });
});

// Delete student data by StudentID
app.delete('/staff/students-manage-delete/:id', (req, res) => {
  const studentId = req.params.id;
  
  // Delete student data from the database
  const deleteSql = 'DELETE FROM staff_manage_students WHERE StudentID=?';
  dbb.query(deleteSql, [studentId], (err, result) => {
    if (err) {
      console.error('Error deleting student data:', err);
      return res.status(500).json({ error: 'An error occurred while deleting student data' });
    }
    
    console.log('Student data deleted successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Student data deleted successfully' });
  });
});

// Fetch all student data
app.get('/staff/students-manage-fetch', (req, res) => {
  // Fetch all student data from the database
  const selectSql = 'SELECT * FROM staff_manage_students';
  dbb.query(selectSql, (err, results) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).json({ error: 'An error occurred while fetching student data' });
    }
    
    console.log('Student data fetched successfully');
    return res.status(200).json(results);
  });
});

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






// Create a new staff-student event
app.post('/staff-student-events', (req, res) => {
  const eventData = req.body;

  // Insert data into the Staff_StudentEvents table
  const sql = 'INSERT INTO staff_studentevents (StaffID, FranchiseID, ParentID, StudentID, EventType, EventName, EventDate, StartTime, EndTime, Location, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  dbb.query(sql, [eventData.StaffID, eventData.FranchiseID, eventData.ParentID, eventData.StudentID, eventData.EventType, eventData.EventName, eventData.EventDate, eventData.StartTime, eventData.EndTime, eventData.Location, eventData.Description], (err, result) => {
      if (err) {
          console.error('Error inserting event:', err);
          return res.status(500).json({ error: 'An error occurred while inserting event' });
      }
      console.log('Event inserted successfully');
      return res.status(200).json({ reasponse: "200" , success: "true",  success: true, message: 'Event inserted successfully' });
  });
});











// Get all staff-student events
app.get('/staff-student-events/fetch', (req, res) => {
  // Fetch all data from the Staff_StudentEvents table
  const sql = 'SELECT * FROM staff_studentevents';
  dbb.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching events:', err);
          return res.status(500).json({ error: 'An error occurred while fetching events' });
      }
      console.log('Events fetched successfully');
      return res.status(200).json(results);
  });
});















app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  



})
