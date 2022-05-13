const mysql = require("mysql2");
// const { initialQuestion } = require("./initialQuestion.js");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const viewAllRoles = () => {
  const sql = `SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department FROM role JOIN department ON department.id = role.department_id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    // initialQuestion();
  });
};

module.exports = { viewAllRoles };
