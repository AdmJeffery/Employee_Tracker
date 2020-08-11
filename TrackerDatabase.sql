DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE employees (
    id  INT NOT NULL,
    first_name VARCHAR (30) NOT NULL,
    last_name VARCHAR (30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL
    PRIMARY KEY (id)
);

CREATE TABLE roledb(
    id INT NOT NULL,
    title VARCHAR (30),
    salary DECIMAL (10,2),
    department_id INT NOT NULL
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INT NOT NULL,
    dept_name VARCHAR(30),
)