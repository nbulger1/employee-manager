const inquirer = require("inquirer");
const {
  addDepartment,
  addEmployee,
  addRole,
  deleteEmployee,
  updateEmployeeManager,
  updateEmployeeRole,
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
  viewByManager,
  quit,
} = require("./inquirerPrompts.js");

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
          "Update Employee Manager",
          "View Employee By Manager",
          "Delete an Employee",
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
        addRole(initialQuestion);
      } else if (userDecision == "View All Departments") {
        viewAllDepartments(initialQuestion);
      } else if (userDecision == "Add Department") {
        addDepartment(initialQuestion);
      } else if (userDecision == "Update Employee Manager") {
        updateEmployeeManager(initialQuestion);
      } else if (userDecision == "View Employee By Manager") {
        viewByManager(initialQuestion);
      } else if (userDecision == "Delete an Employee") {
        deleteEmployee(initialQuestion);
      } else if (userDecision == "Quit") {
        quit();
      }
      return response;
    });
};

module.exports = { initialQuestion };
