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

const updateEmployeeRole = (initialQuestion) => {
  let roleList = [];
  let employeeList = [];

  db.query(`SELECT last_name FROM employee`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      employeeList.push(result[i].last_name);
    }

    db.query(`SELECT title FROM role`, (err, result) => {
      if (err) {
        console.log(err);
      }
      for (i = 0; i < result.length; i++) {
        roleList.push(result[i].title);
      }

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
        .then((response) => {
          const sql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE last_name = ?`;
          const params = [response.updatedRole, response.updatedRoleName];

          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log(`Updated ${response.updatedRoleName}'s role!`);
            initialQuestion();
          });
        });
    });
  });
};

module.exports = { updateEmployeeRole };
