//require inquirer
const inquirer = require("inquirer");

// require the exported query functions from the sqlQueries file
const {
  getDepartments,
  getEmployeeIds,
  getEmployeeNames,
  getManagerIds,
  getManagerNames,
  getRoles,
} = require("./sqlQueries");
//require mysql2
const mysql = require("mysql2");

//create the mysql connection variable db
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

// async function to handle adding a department
const addDepartment = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    // ask the user the name of the new department
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the department?",
          name: "newDeptName",
        },
      ])
      .then((response) => {
        //create a sql variable with the sql command
        const sql = `INSERT INTO department (name) VALUES (?)`;
        //create a variable that holds the variable that will be passed into the ? portion of the sql command
        const params = response.newDeptName;

        //query the database to carry out the sql function with the given parameters
        db.query(sql, params, function (err) {
          // if there is an error then console it
          if (err) {
            console.log(err);
          }
          // if no error then console log that a new department was added
          console.log("---------------------");
          console.log("Added New Department!");
          console.log("---------------------");
          // call the initial function again
          initialQuestion();
          //resolve the asynchronous function
          resolve();
        });
      });
  });
};

// async function to handle deleting an employee
const deleteEmployee = async (initialQuestion) => {
  // create the necessary arrays to carry out the questions and response handling by using await to make sure the database queries are completed before the rest of the function
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
        //grab the index of the employee list array where the employee name matches the name of the chosen employee by the user and use that index to get the employee ID from the employee id variable to ensure the correct employee is deleted
        const employeeID =
          employeeIds[employeeList.indexOf(response.deletedEmployee)];

        const sql = `DELETE FROM employee WHERE id = ?`;
        const params = [employeeID];
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("----------------------------------");
          console.log(`Deleted ${response.deletedEmployee} from the team`);
          console.log("----------------------------------");
          initialQuestion();
          resolve();
        });
      });
  });
};

// async function to handle adding a role
const addRole = async (initialQuestion) => {
  // run the database query to gather the list of current departments
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
        //since there are multiple ? in the sql command, create an array of parameters, in the order in which they will appear in the sql command based on the ? order
        const params = [
          response.newRoleName,
          response.newRoleSalary,
          response.newRoleDept,
        ];
        db.query(sql, params, (err, result) => {
          if (err) {
            reject(console.log(err));
          }
          console.log("----------------------------------");
          console.log(`Added ${response.newRoleName} to the roles list!`);
          console.log("----------------------------------");
          initialQuestion();
          resolve();
        });
      });
  });
};

// async function to handle adding an employee
const addEmployee = async (initialQuestion) => {
  // run the database queries to get arrays for the list of roles, manager names, and manager IDs
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
        //pull the manager ID similar to the employee ID in the function above - by getting the index of the name chosen by the user that matches within the manager name array and then use that index to grab the appropriate manager ID to insert into the employee table
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
          console.log("----------------------------------");
          console.log(`Added ${response.newEmployeeFirst} to the team!`);
          console.log("----------------------------------");
          initialQuestion();
          resolve();
        });
      });
  });
};

// async function to handle updating the employee's manager
const updateEmployeeManager = async (initialQuestion) => {
  //run the database queries to create arrays of manager names, manager ids, employee names, and employee ids
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
        //grab the appropriate employee id and manager id
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
          console.log("----------------------------------");
          console.log(`Updated ${response.updatedRoleName}'s manager!`);
          console.log("----------------------------------");
          initialQuestion();
          resolve();
        });
      });
  });
};

// async function to handle updating an employee's role
const updateEmployeeRole = async (initialQuestion) => {
  // run the database queries to create arrays of the roles, employee names, and employee ids
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

        // use two different database queries in one to update the employee table while also pulling the id from the role table based on the title of the role provided by the user
        const sql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE id = ?`;
        const params = [response.updatedRole, employeeID];

        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("----------------------------------");
          console.log(`Updated ${response.updatedRoleName}'s role!`);
          console.log("----------------------------------");
          initialQuestion();
          resolve();
        });
      });
  });
};

// async function to handle viewing all departments
const viewAllDepartments = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      // use console.table to format the table presented in the console
      console.log("----------------------------------");
      resolve(console.table(result));
      console.log("----------------------------------");
      initialQuestion();
    });
  });
};

//async function to handle viewing all employees
const viewAllEmployees = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    // join the three different tables, employee, role, and department based on the appropriate ids - since the employee table is self referencing, use two versions of the table, e and m, and then LEFT join e to m to get the manager names with their associated employee
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
      console.log(
        "---------------------------------------------------------------------------------"
      );
      resolve(console.table(result));
      console.log(
        "---------------------------------------------------------------------------------"
      );
      initialQuestion();
    });
  });
};

// async function to handle viewing all roles
const viewAllRoles = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department FROM role JOIN department ON department.id = role.department_id`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      console.log(
        "---------------------------------------------------------------------------------"
      );
      resolve(console.table(result));
      console.log(
        "---------------------------------------------------------------------------------"
      );
      initialQuestion();
    });
  });
};

// async function to handle viewing the employees by manager
const viewByManager = async (initialQuestion) => {
  return new Promise((resolve, reject) => {
    // because the employee table is self-referencing use two versions of the table, e and m, to handle the employee names and the manager names and then left join
    const sql = `SELECT e.id AS id, CONCAT(e.first_name, " ", e.last_name) AS  employee, CONCAT(m.first_name, " ", m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m
    ON m.id = e.manager_id
    ORDER BY manager`;
    db.query(sql, (err, result) => {
      if (err) {
        reject(console.log(err));
      }
      console.log("----------------------------------");
      resolve(console.table(result));
      console.log("----------------------------------");
      initialQuestion();
    });
  });
};

// function to handle quitting
const quit = () => {
  console.log("Thank you! Bye!");
  process.kill(process.pid, "SIGTERM");
};

// export the modules so they can be used in the initializing function
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
