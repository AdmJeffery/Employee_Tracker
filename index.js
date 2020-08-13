const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const password = require("./Assets/password.js")

let connection = mysql.createConnection({
    host: "localhost",

    port:3306,

    user: "root",

    password: "",
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
    
    inquirer.prompt ({
        type:"rawlist",
        name:"choice",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Manager",
            "Add Employee",
            "Add Department",
            "Update Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "EXIT"
        ]
    })
    .then(input =>{
        switch(input.choice){
            case "View All Employees":
                console.log("This works!")    
            //viewEmployees();
                break;
            
            case "View All Employees by Manager":
                console.log("This works!")    
            //employeeManage();
                break;

            case "Add Employee":
                console.log("This works!")    
            //addEmployee();
                break;
            
            case "Add Department":
                console.log("This works!")    
            //addDepartment();
                break;
            
            case "Update Employee":
                console.log("This works!")    
            //updateEmployee();
                break;

            case "Update Employee Role":
                console.log("This works!")    
            //updateRole();
                break;

            case "Update Employee Manager":
                console.log("This works!")    
            //updateManager();
                break;
            
            case "EXIT":
                console.log("Goodbye!");
                connection.end();
        }   

    })
}