const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rakesh@2004',
  database: 'mydb'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('MySQL connected as id', db.threadId);
});

// Routes

// Login route (example)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Example simple authentication logic (replace with your actual logic)
  if (username === 'admin' && password === 'password123') {
    res.redirect('/redirect.html'); // Redirect to success page
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Example route to fetch all departments
app.get('/departments', (req, res) => {
  const sql = 'SELECT * FROM departments';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      return res.status(500).json({ error: 'Failed to fetch departments' });
    }
    res.json(results);
  });
});

// Example route to add a department
app.post('/departments', (req, res) => {
  const newDepartment = req.body;
  const sql = 'INSERT INTO departments SET ?';
  db.query(sql, newDepartment, (err, result) => {
    if (err) {
      console.error('Error adding department:', err);
      return res.status(500).json({ error: 'Failed to add department' });
    }
    res.json({ message: 'Department added successfully!', id: result.insertId });
  });
});

// DELETE department by ID
app.delete('/departments/:id', (req, res) => {
  const departmentId = req.params.id;
  const sql = 'DELETE FROM departments WHERE id = ?';

  db.query(sql, [departmentId], (err, result) => {
      if (err) {
          console.error('Error deleting department:', err);
          return res.status(500).json({ error: 'Failed to delete department' });
      }

      if (result.affectedRows > 0) {
          res.json({ message: 'Department deleted successfully!' });
      } else {
          res.status(404).json({ error: 'Department not found' });
      }
  });
});

// Example route to update a department
app.put('/departments/:id', (req, res) => {
  const departmentId = req.params.id;
  const updatedName = req.body.name;
  const sql = 'UPDATE departments SET name = ? WHERE id = ?';

  db.query(sql, [updatedName, departmentId], (err, result) => {
    if (err) {
      console.error('Error updating department:', err);
      return res.status(500).json({ error: 'Failed to update department' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Department ID not found' });
    }
    res.json({ message: 'Department updated successfully!' });
  });
});


app.get('/departments-employees', (req, res) => {
  const departmentsEmployeesQuery = `
    SELECT e.emp_id, e.name AS emp_name, e.salary, e.address, d.id AS department_id, d.name AS dept_name
    FROM employees e
    INNER JOIN departments d ON e.department_id = d.id
  `;

  // Execute the query
  db.query(departmentsEmployeesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching departments and employees:', err);
      return res.status(500).json({ error: 'Failed to fetch departments and employees' });
    }

    // Send the results as JSON response
    res.json(results);
  });
});

// Example route to fetch employees by department ID
app.get('/departments/:id/employees', (req, res) => {
  const departmentId = req.params.id;
  const sql = 'SELECT * FROM employees WHERE department_id = ?';
  db.query(sql, [departmentId], (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }
    res.json(results);
  });
});

// Route to add an employee
app.post('/employees', (req, res) => {
  const { emp_id, name, salary, address, department_id } = req.body;

  // Check if the emp_id is unique across all departments
  const checkSql = 'SELECT * FROM employees WHERE emp_id = ?';
  db.query(checkSql, [emp_id], (err, results) => {
    if (err) {
      console.error('Error checking emp_id uniqueness:', err);
      return res.status(500).json({ error: 'Failed to add employee' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'emp_id already exists' });
    }

    // emp_id is unique, proceed to insert the employee
    const sql = 'INSERT INTO employees SET ?';
    const newEmployee = { emp_id, name, salary, address, department_id };
    db.query(sql, newEmployee, (err, result) => {
      if (err) {
        console.error('Error adding employee:', err);
        return res.status(500).json({ error: 'Failed to add employee' });
      }

      res.json({ message: 'Employee added successfully!', id: result.insertId, emp_id });
    });
  });
});

// Route to update an employee within a department
app.put('/departments/:departmentId/employees/:employeeId', (req, res) => {
  const departmentId = req.params.departmentId;
  const employeeId = req.params.employeeId;
  const { emp_id, name, salary, address, department_id } = req.body;

  console.log(`Update request received for employee ${employeeId} in department ${departmentId}`);

  // Check if the emp_id is unique within the department (excluding the current employee)
  const checkSql = 'SELECT * FROM employees WHERE emp_id = ? AND department_id = ? AND id != ?';
  db.query(checkSql, [emp_id, departmentId, employeeId], (err, results) => {
    if (err) {
      console.error('Error checking emp_id uniqueness:', err);
      return res.status(500).json({ error: 'Failed to update employee' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'emp_id already exists within this department' });
    }

    // emp_id is unique, proceed to update the employee
    const updateSql = 'UPDATE employees SET emp_id = ?, name = ?, salary = ?, address = ?, department_id = ? WHERE emp_id = ? AND department_id = ?';
    db.query(updateSql, [emp_id, name, salary, address, departmentId, employeeId, departmentId], (err, result) => {
      if (err) {
        console.error('Error updating employee:', err);
        return res.status(500).json({ error: 'Failed to update employee' });
      }
      if (result.affectedRows === 0) {
        console.log(`Employee ${employeeId} not found in department ${departmentId}`);
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee updated successfully!' });
    });
  });
});

// Route to delete an employee within a department
app.delete('/employees', (req, res) => {
  const { empId, deptId } = req.body;

  console.log(`Delete request received for employee ${empId} in department ${deptId}`);

  const deleteSql = 'DELETE FROM employees WHERE emp_id = ? AND department_id = ?';
  db.query(deleteSql, [empId, deptId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    if (result.affectedRows === 0) {
      console.log(`Employee ${empId} not found in department ${deptId}`);
      return res.status(404).json({ error: 'Employee not found in the specified department' });
    }
    res.json({ message: 'Employee deleted successfully!' });
  });
});

// Serve HTML files (example)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // Ensure this path is correct
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Login page available at: http://localhost:${PORT}`);
});
