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
        viewAllEmployees(initialQuestion);
      } else if (userDecision == "Add Employee") {
        addEmployee(initialQuestion);
      } else if (userDecision == "Update Employee Role") {
        updateEmployeeRole(initialQuestion);
      } else if (userDecision == "View All Roles") {
        viewAllRoles(initialQuestion);
      } else if (userDecision == "Add Role") {
        addRole();
      } else if (userDecision == "View All Departments") {
        viewAllDepartments(initialQuestion);
      } else if (userDecision == "Add Department") {
        addDepartment(initialQuestion);
      } else if (userDecision == "Quit") {
        quit();
      }
      return response;
    });
};

module.exports = { initialQuestion };
