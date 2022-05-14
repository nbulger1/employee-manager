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

const addEmployee = (initialQuestion) => {
  let roleList = [];
  let managerList = [];

  db.query(`SELECT title FROM role`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i = 0; i < result.length; i++) {
      roleList.push(result[i].title);
    }
    return roleList;
  });

  db.query(
    `SELECT last_name manager_id FROM employee WHERE manager_id IS NULL`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      for (i = 0; i < result.length; i++) {
        managerList.push(result[i].manager_id);
      }
      return managerList;
    }
  );

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
      console.log(response);
      const sql = `INSERT INTO employee (first_name, last_name, role_id) 
        VALUES (?, ?, (SELECT id FROM role WHERE title = ?))`;
      const params = [
        response.newEmployeeFirst,
        response.newEmployeeLast,
        response.newEmployeeRole,
      ];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
        }
        const sqlTwo = `SELECT id FROM employee WHERE last_name = ?`;
        const managerLast = response.newEmployeeManager;
        let managerId;
        db.query(sqlTwo, managerLast, (err, result) => {
          if (err) {
            console.log(err);
          }
          managerId = result[0].id;

          const sqlThree = `UPDATE employee SET manager_id = ? WHERE last_name = ?`;
          const paramsTwo = [managerId, response.newEmployeeLast];
          db.query(sqlThree, paramsTwo, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log(`Added ${response.newEmployeeFirst} to the team!`);
            initialQuestion();
          });
        });
      });
    });
};

module.exports = { addEmployee };
