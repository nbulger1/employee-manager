USE employee_db;

INSERT INTO department (name)
VALUES ("Software"),
       ("Human Resources"),
       ("Marketing"),
       ("Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 100.0, 1),
       ("Director of HR", 83.0, 2),
       ("Marketing Agent", 70.0, 3),
       ("Front-End Developer", 80.0, 4);

INSERT INTO manager (name)
VALUES ("John Smith"),
       ("Karen Matthews");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mitchell", "Scott", 1, 1),
       ("Catherine", "Counts", 2, 2),
       ("Julia", "Childs", 3, 2),
       ("Natalie", "Bulger", 4, 1);

