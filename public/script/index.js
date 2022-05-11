const inquirer = require("inquirer");

//Array of questions for the user with conditionals for those that only appear for certain employee types
const questions = [
  {
    type: "rawlist",
    message: "Is the employee a manager, intern, or engineer?",
    name: "employeeType",
    choices: ["manager", "engineer", "intern"],
  },
  {
    type: "input",
    message: "What is the employee's name?",
    name: "name",
  },
  {
    type: "input",
    message: "What is the employee's id?",
    name: "id",
  },
  {
    type: "input",
    message: "What is the employee's email?",
    name: "email",
    default: () => {},
    validate: function (email) {
      valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

      if (!valid) {
        console.log(".  Please enter a valid email");
        return false;
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    message: "What is the intern's school?",
    name: "school",
    when: (response) => response.employeeType == "intern",
  },
  {
    type: "input",
    message: "What is the engineer's Github username?",
    name: "githubUsername",
    when: (response) => response.employeeType == "engineer",
  },
  {
    type: "input",
    message: "What is the engineer's Github URL?",
    name: "githubUrl",
    when: (response) => response.employeeType == "engineer",
  },
  {
    type: "input",
    message: "What is the manager's office number?",
    name: "officeNumber",
    when: (response) => response.employeeType == "manager",
  },
  {
    type: "confirm",
    message: "Would you like to add another employee?",
    name: "anotherEmployee",
  },
];

// Function to initialize app that uses inquirer to prompt the question array and then use the response object to create a new employee from all the information provided by the user. If the user is done entering employees then run the writeToFile function other re-prompt the questions
function init() {
  return inquirer.prompt(questions).then((response) => {
    createNewEmployee(response);
    if (!response.anotherEmployee) {
      writeToHtml(response);
    } else {
      return init();
    }
  });
}

//initialize the app
init();
