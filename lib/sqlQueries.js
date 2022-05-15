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

const getRoles = () => {
  let roleList = [];
  return new Promise((resolve, reject) => {
    db.query(`SELECT title FROM role`, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      for (i = 0; i < result.length; i++) {
        roleList.push(result[i].title);
      }
      resolve(roleList);
    });
  });
};

const getManagerNames = () => {
  let managerList = [];
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, CONCAT(first_name, " ", last_name) AS manager_name, manager_id FROM employee WHERE manager_id IS NULL`,
      (err, result) => {
        if (err) {
          reject(console.log(err));
        }
        for (i = 0; i < result.length; i++) {
          managerList.push(result[i].manager_name);
        }
        resolve(managerList);
      }
    );
  });
};

const getManagerIds = () => {
  let managerIds = [];
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, manager_id FROM employee WHERE manager_id IS NULL`,
      (err, result) => {
        if (err) {
          reject(console.log(err));
        }
        for (i = 0; i < result.length; i++) {
          managerIds.push(result[i].id);
        }
        resolve(managerIds);
      }
    );
  });
};

const getDepartments = () => {
  let departmentList = [];
  return new Promise((resolve, reject) => {
    db.query(`SELECT name FROM department`, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      for (i = 0; i < result.length; i++) {
        departmentList.push(result[i].name);
      }
      resolve(departmentList);
    });
  });
};

const getEmployeeNames = () => {
  let employeeList = [];

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee`,
      (err, result) => {
        if (err) {
          reject(console.log(err));
        }
        for (i = 0; i < result.length; i++) {
          employeeList.push(result[i].employee_name);
        }
        resolve(employeeList);
      }
    );
  });
};

const getEmployeeIds = () => {
  let employeeIds = [];

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee`,
      (err, result) => {
        if (err) {
          reject(console.log(err));
        }
        for (i = 0; i < result.length; i++) {
          employeeIds.push(result[i].id);
        }
        resolve(employeeIds);
      }
    );
  });
};

module.exports = {
  getDepartments,
  getEmployeeIds,
  getEmployeeNames,
  getManagerIds,
  getManagerNames,
  getRoles,
};
