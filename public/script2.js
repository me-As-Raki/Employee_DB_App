document.getElementById('addEmployeeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emp_id = document.getElementById('emp_id').value;
    const name = document.getElementById('name').value;
    const salary = document.getElementById('salary').value;
    const address = document.getElementById('address').value;
    const department_id = document.getElementById('department_id').value;

    const newEmployee = { emp_id, name, salary, address, department_id };

    fetch('/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Employee added successfully!');
            location.reload(); // Reload the page to show the added employee
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Fetch and display employee details
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const departmentId = urlParams.get('departmentId');
    fetch(`/departments/${departmentId}/employees`)
      .then(response => response.json())
      .then(data => {
        const employeeList = document.getElementById('employeeList');
        if (data.length > 0) {
          data.forEach(employee => {
            const employeeDiv = document.createElement('div');
            employeeDiv.innerHTML = `<p>${employee.emp_id} - ${employee.name} - ${employee.salary}</p>`;
            employeeList.appendChild(employeeDiv);
          });
        } else {
          employeeList.innerHTML = '<p>No employees found.</p>';
        }
      })
      .catch(error => console.error('Error fetching employee details:', error));
  });
  
  // Function to handle deleting an employee
 document.addEventListener('DOMContentLoaded', () => {
  const deleteForm = document.getElementById('deleteEmployeeForm');

  if (deleteForm) {
    deleteForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const emp_id = document.getElementById('emp_id').value;
      const department_id = document.getElementById('department_id').value;

      if (!emp_id || !department_id) {
        alert("Please provide both Employee ID and Department ID.");
        return;
      }

      const payload = { emp_id, department_id };

      fetch('/employees', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
          } else {
            alert(data.message || "Employee deleted successfully!");
            deleteForm.reset();
          }
        })
        .catch((error) => {
          console.error("Delete error:", error);
          alert("Failed to delete employee. Please try again.");
        });
    });
  }
});
