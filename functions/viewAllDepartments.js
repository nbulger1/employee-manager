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

const viewAllDepartments = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    // initialQuestion();
  });
};

module.exports = { viewAllDepartments };
