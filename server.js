const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

console.log(
  logo({
    name: "Employee Manager",
    font: "Speed",
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: "grey",
    logoColor: "bold-green",
    textColor: "green",
  }).render()
);

const intialQuestion = () => {
  inquirer
    .prompt([
      {
        type: "rawlist",
        message: "What would you like to do?",
        name: "userDecision",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      const { userDecision } = response;

      if (userDecision == "View All Employees") {
        viewAllEmployees();
      } else if (userDecision == "Add Employee") {
        addEmployee();
      } else if (userDecision == "Update Employee Role") {
        updateEmployeeRole();
      } else if (userDecision == "View All Roles") {
        viewAllRoles();
      } else if (userDecision == "Add Role") {
        addRole();
      } else if (userDecision == "View All Departments") {
        viewAllDepartments();
      } else if (userDecision == "Add Department") {
        addDepartment();
      } else if (userDecision == "Quit") {
        quit();
      }
    });
};

const viewAllEmployees = () => {
  db.query(`SELECT * from employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
  });
};

const viewAllRoles = () => {
  db.query(`SELECT id, title FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
  });
};

const viewAllDepartments = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
  });
};

const addEmployee = () => {
  let roleList = [];
  let managerList = [];

  db.query(`SELECT title from role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      roleList.push(result[i].title);
    }
    return roleList;
  });

  db.query(`SELECT name from manager`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      managerList.push(result[i].name);
    }
    return managerList;
  });

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the new employee's first name?",
        name: "newEmployeeFirst",
      },
      {
        type: "input",
        message: "What is the new employee's last name?",
        name: "newEmployeeLast",
      },
      {
        type: "rawlist",
        message: "What is the employee's role?",
        name: "newEmployeeRole",
        choices: roleList,
      },
      {
        type: "rawlist",
        message: "Who is the employee's manager?",
        name: "newEmployeeManager",
        choices: managerList,
      },
    ])
    .then((response) => {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${response.newEmployeeFirst}", "${response.newEmployeeLast}", (SELECT id FROM role WHERE title = "${response.newEmployeeRole}"), (SELECT id FROM manager WHERE name = "${response.newEmployeeManager}"))`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`Added ${response.newEmployeeFirst} to the team!`);
        }
      );
    });
};

const updateEmployeeRole = () => {
  let roleList = [];
  let employeeList = [];

  db.query(`SELECT title FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      roleList.push(result[i].title);
    }
    return roleList;
  });

  db.query(`SELECT last_name FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      employeeList.push(result[i].last_name);
    }
    return employeeList;
  });
  inquirer
    .prompt([
      {
        type: "rawlist",
        message: "Which employee would you like to update?",
        name: "updatedRoleName",
        choices: employeeList,
      },
      {
        type: "rawlist",
        message: "Which role do you want to assign to this employee?",
        name: "updatedRole",
        choices: roleList,
      },
    ])
    .then(response);
};

const addRole = () => {
  let departmentList = [];

  db.query(`SELECT name FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      departmentList.push(result[i].name);
    }
    return departmentList;
  });
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "newRoleName",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "newRoleSalary",
      },
      {
        type: "rawlist",
        message: "What is the department does the role belong to?",
        name: "newRoleDept",
        choices: departmentList,
      },
    ])
    .then((response) => {
      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${response.newRoleName}", "${response.newRoleSalary}", (SELECT id FROM department WHERE name = "${response.newRoleDept}"))`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`Added ${response.newRoleName} to the roles list!`);
        }
      );
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "newDeptName",
      },
    ])
    .then((response) => {
      console.log(response);
      db.query(
        `INSERT INTO department SET ?`,
        {
          name: response.newDeptName,
        },
        function (err) {
          if (err) {
            console.log(err);
          }
          console.log("Added New Department!");
        }
      );
    });
};

intialQuestion();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
