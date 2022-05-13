const mysql = require("mysql2");
// const { initialQuestion } = require("./initialQuestion.js");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

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
      const sql = `INSERT INTO department (name) VALUES (?)`;
      const params = response.newDeptName;

      db.query(sql, params, function (err) {
        if (err) {
          console.log(err);
        }
        console.log("Added New Department!");
        // initialQuestion();
      });
    });
};

module.exports = { addDepartment };
