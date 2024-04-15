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

// owner fetch dashboard 
app.get('/owner/dashboard-fetch-info/:dashboardID', (req, res) => {
  const dashboardID = req.params.dashboardID;
  const sql = `SELECT * FROM Owner_Dashboard WHERE DashboardID = ?`;

  dbb.query(sql, dashboardID, (err, results) => {
    if (err) {
      console.error('Error fetching owner dashboard:', err);
      return res.status(500).json({ error: 'An error occurred while fetching owner dashboard' });
    }
    console.log('Owner dashboard fetched successfully');
    return res.status(200).json(results[0]);
  });
});


// Update Owner Dashboard 
app.put('/owner/dashboard-update/:dashboardID', (req, res) => {
  const dashboardID = req.params.dashboardID;
  const { FranchiseID, TotalClasses, TotalCourses } = req.body;
  const sql = `UPDATE Owner_Dashboard SET FranchiseID = ?, TotalClasses = ?, TotalCourses = ? WHERE DashboardID = ?`;
  const values = [FranchiseID, TotalClasses, TotalCourses, dashboardID];

  dbb.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating owner dashboard:', err);
      return res.status(500).json({ error: 'An error occurred while updating owner dashboard' });
    }
    console.log('Owner dashboard updated successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Owner dashboard updated successfully' });
  });
});





// Update Financial Transaction API
app.put('/owner/financial-management-update/:transactionID', (req, res) => {
  const transactionID = req.params.transactionID;
  const { FranchiseID, TransactionDate, Description, Amount, Category, PaymentMethod, Reference } = req.body;
  const sql = `UPDATE owner_financialmanagement SET FranchiseID=?, TransactionDate=?, Description=?, Amount=?, Category=?, PaymentMethod=?, Reference=? WHERE TransactionID=?`;
  const values = [FranchiseID, TransactionDate, Description, Amount, Category, PaymentMethod, Reference, transactionID];

  dbb.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating financial transaction:', err);
      return res.status(500).json({ error: 'An error occurred while updating financial transaction' });
    }
    console.log('Financial transaction updated successfully');
    return res.status(200).json({reasponse: "200" , success: "true", message: 'Financial transaction updated successfully' });
  });
});

// Get Financial Transaction by ID API
app.get('/owner/financial-management-fetch/:transactionID', (req, res) => {
  const transactionID = req.params.transactionID;
  const sql = `SELECT * FROM owner_financialmanagement WHERE TransactionID = ?`;

  dbb.query(sql, transactionID, (err, result) => {
    if (err) {
      console.error('Error fetching financial transaction:', err);
      return res.status(500).json({ error: 'An error occurred while fetching financial transaction' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Financial transaction not found' });
    }
    console.log('Financial transaction fetched successfully');
    return res.status(200).json(result[0]);
  });
});




//  Owner_FacilityInfrastructure table
app.post('/owner/facility-infrastructure', (req, res) => {
  const { FranchiseID, FacilityName, Description, Capacity, Status } = req.body;

  // Insert data into the Owner_FacilityInfrastructure table
  const sql = 'INSERT INTO Owner_FacilityInfrastructure (FranchiseID, FacilityName, Description, Capacity, Status) VALUES (?, ?, ?, ?, ?)';
  dbb.query(sql, [FranchiseID, FacilityName, Description, Capacity, Status], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'An error occurred while inserting data' });
    }
    console.log('Data inserted successfully');
    return res.status(200).json({ reasponse: "200" , success: "true", message: 'Data inserted successfully' });
  });
});


// Owner_FacilityInfrastructure update
app.put('/owner/facility-infrastructure/update/:facilityID', (req, res) => {
  const facilityID = req.params.facilityID;
  const { FranchiseID, FacilityName, Description, Capacity, Status } = req.body;

  const sql = 'UPDATE Owner_FacilityInfrastructure SET FranchiseID=?, FacilityName=?, Description=?, Capacity=?, Status=? WHERE FacilityID=?';
  dbb.query(sql, [FranchiseID, FacilityName, Description, Capacity, Status, facilityID], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'An error occurred while updating data' });
    }
    console.log('Data updated successfully');
    return res.status(200).json({ reasponse: "200", success: "true", message: 'Data updated successfully' });
  });
});

// owner-infrastructure get 
app.get('/owner/facility-infrastructure/:facilityID', (req, res) => {
  const facilityID = req.params.facilityID;

  const sql = 'SELECT * FROM Owner_FacilityInfrastructure WHERE FacilityID=?';
  dbb.query(sql, [facilityID], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    return res.status(200).json(result[0]); // Assuming there is only one facility with a given FacilityID
  });
});



// governance-board 
app.post('/governance-board', (req, res) => {
  const { FranchiseID, BoardMemberName, Position, ContactEmail, ContactPhone } = req.body;

  const sql = 'INSERT INTO Owner_governance_boardmanagement (FranchiseID, BoardMemberName, Position, ContactEmail, ContactPhone) VALUES (?, ?, ?, ?, ?)';
  dbb.query(sql, [FranchiseID, BoardMemberName, Position, ContactEmail, ContactPhone], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'An error occurred while inserting data' });
    }
    console.log('Data inserted successfully');
    return res.status(200).json({reasponse: "200", success: "true", message: 'Data inserted successfully' });
  });
});


// get specific governance boad 
app.get('/governance-board/fetch/:governanceID', (req, res) => {
  const governanceID = req.params.governanceID;

  const sql = 'SELECT * FROM Owner_governance_boardmanagement WHERE GovernanceID = ?';
  dbb.query(sql, [governanceID], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Governance member not found' });
    }
    return res.status(200).json(result[0]); 
  });
});

// get  all governance boad 
app.get('/governance-board/fetch', (req, res) => {
  const sql = 'SELECT * FROM Owner_governance_boardmanagement';
  dbb.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'No governance members found' });
    }
    return res.status(200).json(result); 
  });
});


/// owner global events
app.post('/owner/global-events', (req, res) => {
  const { EventType, EventName, EventDate, StartTime, EndTime, Location, Description, Organizer } = req.body;
  
  const sql = 'INSERT INTO owner_globalevents (EventType, EventName, EventDate, StartTime, EndTime, Location, Description, Organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  dbb.query(sql, [EventType, EventName, EventDate, StartTime, EndTime, Location, Description, Organizer], (err, result) => {
    if (err) {
      console.error('Error inserting event:', err);
      return res.status(500).json({ error: 'An error occurred while inserting event' });
    }
    console.log('Event inserted successfully');
    return res.status(200).json({ reasponse: "200", success: "true", message: 'Event inserted successfully' });
  });
});


// owner global events fetch
app.get('/owner/global-events/fetch', (req, res) => {
  const sql = 'SELECT * FROM owner_globalevents';
  dbb.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'An error occurred while fetching events' });
    }
    console.log('Events fetched successfully');
    return res.status(200).json(results);
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
      return res.status(200).json({ success: true, message: 'Event inserted successfully' });
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
