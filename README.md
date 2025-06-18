
# 🗂️ TeamNest — Dept-Wise Employee Manager 🚀  
**Manage your workforce like a pro!** A dynamic Node.js & MySQL-powered Employee Management System with a sleek UI and full CRUD functionality.

---

## 📌 Features

- 👥 Department-wise employee management
- 📝 Add, edit, and delete employees
- 🔍 View employees by department
- 💾 MySQL database integration
- ⚡ Fast and responsive with Bootstrap + EJS

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Bootstrap, EJS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Tools:** VS Code, Git

---

## 🚀 How to Run This Project

### 1. Clone the repository

```bash
git clone https://github.com/me-As-Raki/Employee_DB_App.git
cd Employee_DB_App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL Database

- Create a database named `employee`
- Make sure your MySQL username/password matches what's in `server.js`
- Add your `employee` and `department` tables

### 4. Run the server

```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Example SQL Schema

```sql
CREATE DATABASE employee;
USE employee;

CREATE TABLE department (
  dept_id INT PRIMARY KEY,
  dept_name VARCHAR(50)
);

CREATE TABLE employee (
  emp_id INT PRIMARY KEY,
  emp_name VARCHAR(100),
  salary INT,
  address VARCHAR(255),
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);
```

---

## 🧑‍💻 Author

- Developed by **Rakesh Poojary**

---
## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20App-Visit-blue?style=for-the-badge)]([https://resume-screener-5.onrender.com](https://employee-db-app.onrender.com))

