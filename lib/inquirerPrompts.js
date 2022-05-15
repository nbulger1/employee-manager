const inquirer = require("inquirer");
const {
  getDepartments,
  getEmployeeIds,
  getEmployeeNames,
  getManagerIds,
  getManagerNames,
  getRoles,
} = require("./sqlQueries");
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

const addDepartment = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
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
          initialQuestion();
          resolve();
        });
      });
  });
};

const deleteEmployee = async (initialQuestion) => {
  let employeeList = await getEmployeeNames();
  let employeeIds = await getEmployeeIds();

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "rawlist",
          message: "Which employee would you like to delete?",
          name: "deletedEmployee",
          choices: employeeList,
        },
      ])
      .then((response) => {
        const employeeID =
          employeeIds[employeeList.indexOf(response.deletedEmployee)];

        const sql = `DELETE FROM employee WHERE id = ?`;
        const params = [employeeID];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`Deleted ${response.deletedEmployee} from the team`);
          initialQuestion();
          resolve();
        });
      });
  });
};

const addRole = async (initialQuestion) => {
  let departmentList = await getDepartments();

  return new Promise((resolve, reject) => {
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
            reject(console.log(err));
          }
          console.log(`Added ${response.newRoleName} to the roles list!`);
          initialQuestion();
          resolve();
        });
      });
  });
};

const addEmployee = async (initialQuestion) => {
  let roleList = await getRoles();
  let managerList = await getManagerNames();
  let managerIds = await getManagerIds();

  return new Promise((resolve, reject) => {
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
        const managerID =
          managerIds[managerList.indexOf(response.newEmployeeManager)];

        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
          VALUES (?, ?, (SELECT id FROM role WHERE title = ?), ?)`;
        const params = [
          response.newEmployeeFirst,
          response.newEmployeeLast,
          response.newEmployeeRole,
          managerID,
        ];

        db.query(sql, params, (err, result) => {
          if (err) {
            reject(console.log(err));
          }
          console.log(`Added ${response.newEmployeeFirst} to the team!`);
          initialQuestion();
          resolve();
        });
      });
  });
};

const updateEmployeeManager = async (initialQuestion) => {
  let managerList = await getManagerNames();
  let managerIds = await getManagerIds();
  let employeeList = await getEmployeeNames();
  let employeeIds = await getEmployeeIds();

  return new Promise((resolve, reject) => {
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
          message: "Who is the employee's new manager?",
          name: "updatedManager",
          choices: managerList,
        },
      ])
      .then((response) => {
        const employeeID =
          employeeIds[employeeList.indexOf(response.updatedRoleName)];
        const managerID =
          managerIds[managerList.indexOf(response.updatedManager)];

        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        const params = [managerID, employeeID];

        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`Updated ${response.updatedRoleName}'s manager!`);
          initialQuestion();
          resolve();
        });
      });
  });
};

const updateEmployeeRole = async (initialQuestion) => {
  let roleList = await getRoles();
  let employeeList = await getEmployeeNames();
  let employeeIds = await getEmployeeIds();

  return new Promise((resolve, reject) => {
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
        const employeeID =
          employeeIds[employeeList.indexOf(response.updatedRoleName)];

        const sql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE id = ?`;
        const params = [response.updatedRole, employeeID];

        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`Updated ${response.updatedRoleName}'s role!`);
          initialQuestion();
          resolve();
        });
      });
  });
};

const viewAllDepartments = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      resolve(console.table(result));
      initialQuestion();
    });
  });
};

const viewAllEmployees = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager
      FROM employee e
      LEFT JOIN employee m
      ON m.id = e.manager_id
      JOIN role
      ON e.role_id = role.id
      JOIN department
      ON role.department_id = department.id`;
    db.query(sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(console.table(result));
      initialQuestion();
    });
  });
};

const viewAllRoles = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department FROM role JOIN department ON department.id = role.department_id`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      resolve(console.table(result));
      initialQuestion();
    });
  });
};

const viewByManager = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT e.id AS id, CONCAT(e.first_name, " ", e.last_name) AS  employee, CONCAT(m.first_name, " ", m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m
    ON m.id = e.manager_id`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      resolve(console.table(result));
      initialQuestion();
    });
  });
};

const quit = () => {
  console.log("Thank you! Bye!");
  process.kill(process.pid, "SIGTERM");
};

module.exports = {
  addDepartment,
  addEmployee,
  addRole,
  deleteEmployee,
  updateEmployeeManager,
  updateEmployeeRole,
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
  viewByManager,
  quit,
};
