//require inquirer
const inquirer = require("inquirer");
//require all of the prompt questions exported from the "inquirerPrompts" file
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
  viewTotalUtilizedBudget,
  quit,
} = require("./userOptions.js");

// Create an initial function to call in the server file
const initialQuestion = () => {
  // Provide the user with the list of possible options
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
          "View Total Utilized Budget",
          "Delete an Employee",
          "Quit",
        ],
      },
    ])
    //based on the options execute the appropriate function
    .then((response) => {
      // create a User Decision variable that equals the user response
      const { userDecision } = response;

      // an if/else if statement that runs the appropriate function based on the user response
      if (userDecision == "View All Employees") {
        // the function receives the initializing function so that it can be called again
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
      } else if (userDecision == "View Total Utilized Budget") {
        viewTotalUtilizedBudget(initialQuestion);
      } else if (userDecision == "Delete an Employee") {
        deleteEmployee(initialQuestion);
      } else if (userDecision == "Quit") {
        quit();
      }
      //return the response so it can be used
      return response;
    });
};

// Exports the initializing function to be used in the server file
module.exports = { initialQuestion };
