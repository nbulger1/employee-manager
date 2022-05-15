//require the mysql package
const mysql = require("mysql2");

//create the variable db to handle the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

// function to get an array of the roles in the database
const getRoles = () => {
  let roleList = [];
  return new Promise((resolve, reject) => {
    db.query(`SELECT title FROM role`, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      // take the result of the database query and push them onto the roleList array
      for (i = 0; i < result.length; i++) {
        roleList.push(result[i].title);
      }
      //resolve the promise with the new array
      resolve(roleList);
    });
  });
};

// function to get an array of manager names
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

// function to get an array of manager ids
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

// function to get an array of department names
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

//function to get an array of employee names
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

// function to get an array of employee IDs
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

// export all of the query functions so they can be used in the prompt functions
module.exports = {
  getDepartments,
  getEmployeeIds,
  getEmployeeNames,
  getManagerIds,
  getManagerNames,
  getRoles,
};
