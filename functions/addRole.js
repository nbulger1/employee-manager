const mysql = require("mysql2");
const { initialQuestion } = require("./initialQuestion.js");
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

const addRole = (initialQuestion) => {
  let departmentList = [];

  db.query(`SELECT name FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      departmentList.push(result[i].name);
    }
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
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))`;
        const params = [
          response.newRoleName,
          response.newRoleSalary,
          response.newRoleDept,
        ];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`Added ${response.newRoleName} to the roles list!`);
          initialQuestion();
        });
      });
  });
};

module.exports = { addRole };
