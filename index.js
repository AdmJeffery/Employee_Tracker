const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")

let connection = mysql.createConnection({
    host: "localhost",

    port:8080,

    user: "root",

    password:"",
    database:"employee_trackerDB"
})

connection.connect((err) => {
    if (err) throw err;
    startTracker();
})

function startTracker() {
    console.log("Welcome to Employee Tracker 1.0!")
    mainMenu();
}

function mainMenu(){
    console.log("What would you like to do?")
    inquirer.prompt ({
        type:"rawlist",
        name:"choice",
        message: [
            "View All Employees",
            "View All Employees by Manager",
            "Add Employee",
            "Add Department",
            "Update Employee",
            "Update Employee Role",
            "Update Employee Manager",
        ]
    })
    .then(input =>{
        switch(input.choice){
            case "View All Employees":
                viewEmployees();
                break;
            
            case "View All Employees by Manager":
                employeeManage();
                break;

            case "Add Employee":
                addEmployee();
                break;
            
            case "Add Department":
                addDepartment();
                break;
            
            case "Update Employee":
                updateEmployee();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "Update Employee Manager":
                updateManager();
                break;
        }   

    })
}