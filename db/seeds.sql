USE employee_db;

INSERT INTO department (name)
VALUES ("Software"),
       ("Human Resources"),
       ("Marketing"),
       ("Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 100000, 1),
       ("Director of HR", 83000, 2),
       ("Marketing Agent", 70000, 3),
       ("Front-End Developer", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mitchell", "Scott", 1, NULL),
       ("Catherine", "Counts", 2, 1),
       ("Julia", "Childs", 3, NULL),
       ("Natalie", "Bulger", 4, 1);

