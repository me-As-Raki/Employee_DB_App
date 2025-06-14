document.addEventListener("DOMContentLoaded", function() {
    loadDepartments();

    const addForm = document.getElementById("add-department-form");
    const deleteForm = document.getElementById("delete-department-form");
    const updateForm = document.getElementById("update-department-form");

    if (addForm) {
        addForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const departmentId = document.getElementById("departmentId").value;
            const departmentName = document.getElementById("departmentName").value;
            fetch("/departments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: departmentId, name: departmentName })
            }).then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = 'department.html';
            });
        });
    }

    if (deleteForm) {
        deleteForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const departmentId = document.getElementById("departmentId").value;
            if (confirm("Are you sure you want to delete this department?")) {
                fetch(`/departments/${departmentId}`, {
                    method: "DELETE"
                }).then(response => response.json())
                .then(data => {
                    alert(data.message);
                    window.location.href = 'department.html';
                });
            }
        });
    }

    if (updateForm) {
        updateForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const departmentId = document.getElementById("departmentId").value;
            const departmentName = document.getElementById("departmentName").value;
            fetch(`/departments/${departmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: departmentName })
            }).then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = 'department.html';
            });
        });
    }
});

function loadDepartments() {
    fetch("/departments")
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector("#department-table tbody");
        tableBody.innerHTML = "";
        data.forEach(department => {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            const nameCell = document.createElement("td");
            idCell.textContent = department.id;
            nameCell.textContent = department.name;
            row.appendChild(idCell);
            row.appendChild(nameCell);
            tableBody.appendChild(row);
        });
    });
}
