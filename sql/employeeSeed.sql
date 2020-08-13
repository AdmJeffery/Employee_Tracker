USE employees_db;

INSERT INTO departments (dept_name)
VALUES ("Sales");
INSERT INTO departments (dept_name)
VALUES ("Product");
INSERT INTO departments (dept_name)
VALUES ("Marketing");
INSERT INTO departments (dept_name)
VALUES ("Accounting");

INSERT INTO roledb (title, salary, department_id)
VALUES ("Sales Associate", 40000, 1), ("Sales Lead", 60000, 1),
("Software Developer", 80000, 2), ("Software Designer", 60000, 2),
("Marketing Associate", 50000, 3), ("Marketing Team Lead", 80000, 3),
("Accountant", 60000, 4), ("Senior Accountant", 80000, 4);
