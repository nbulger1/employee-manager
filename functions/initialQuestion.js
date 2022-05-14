const inquirer = require("inquirer");
const { viewAllEmployees } = require("./viewAllEmployess.js");
const { addEmployee } = require("./addEmployee.js");
const { viewAllRoles } = require("./viewAllRoles.js");
const { viewAllDepartments } = require("./viewAllDepartments.js");
const { updateEmployeeRole } = require("./updateEmployeeRole.js");
const { addRole } = require("./addRole.js");
const { addDepartment } = require("./addDepartment.js");
const { quit } = require("./quit.js");

const initialQuestion = () => {
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
      return response;
    });
};

module.exports = { initialQuestion };
