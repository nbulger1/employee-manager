const { initialQuestion } = require("./initialQuestion.js");

const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const viewAllEmployees = (initialQuestion) => {
  const sql = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, m.last_name AS manager
    FROM employee e
    LEFT JOIN employee m
    ON m.id = e.manager_id
    JOIN role
    ON e.role_id = role.id
    JOIN department
    ON role.department_id = department.id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    initialQuestion();
  });
};

module.exports = { viewAllEmployees };
