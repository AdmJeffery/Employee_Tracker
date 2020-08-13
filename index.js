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

let employeeId;


const roles = [];
connection.query("SELECT title FROM roledb", function (err, res){
    if (err) throw err;
    
    for (i=0; i<res.length; i++){
        roles.push(res[i].title)
    }
});

let roleAndId = [];

function startTracker() {
    console.log("Welcome to Employee Tracker 1.0!")
    mainMenu();
}

function mainMenu(){
    
    inquirer.prompt ({
        type:"list",
        name:"choice",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View Roles",
            "View Departments",
            "View All Employees by Manager",
            "Add Employee",
            "Add Department",
            "Update Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "EXIT"
        ]
    })
    .then(response =>{
        switch(response.choice){
            case "View All Employees":
                    
                viewEmployees();
                break;
            
            case "View Roles":
                
                viewRoles();
                break;
            
            case "View Departments":
                
                viewDept();
                break;

            case "View All Employees by Manager":
                console.log("This works!")    
            //employeeManage();
                break;

            case "Add Employee":
                //console.log("This works!")    
                addEmployee();
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

function viewEmployees(){
    connection.query("SELECT * FROM employees", function (err, res){
        if (err) throw err;
        //console.log(res)
        
        let employeeInfo = [];

        for (i=0; i<res.length; i++){
            employeeInfo.push({
                name: res[i].first_name + " " + res[i].last_name,
                role: res[i].role_id,
                manager: res[i].manager 
            })
        }
        console.table(employeeInfo)
        mainMenu();

    })
}

function viewRoles(){
    connection.query("SELECT * FROM roledb", function (err, res){
        if (err) throw err;

        let roledbInfo = [];

        for ( i=0; i<res.length; i++){
            roledbInfo.push({
                id: res[i].id,
                title: res[i].title,
                salary: res[i].salary,
                department_id: res[i].department_id

            })
            console.table(roledbInfo);
            mainMenu();
        }
    })
}

function viewDept(){
    connection.query("SELECT * FROM departments", function (err, res){
        if (err) throw err;
       
        let depts = [];

        for(i=0; i<res.length; i++){
            depts.push({
                id: res[i].id,
                dept_name: res[i].dept_name

            })
            console.table(depts);
            mainMenu();
        }
    })
}

function addEmployee(){
    
    inquirer
        .prompt ([
    {
        type: "input",
        name: "firstname",
        message: "Enter the employee's first name."
    },
    {
        type:"input",
        name: "lastname",
        message: "Enter the employee's last name."
    },
    {
        type: "input",
        name:"manager",
        message: "Enter the employee's manager."
    },
    {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roles
    },
    
])
    .then (response => {
        //console.log(response)
        let roleId;
        connection.query("SELECT id FROM roledb WHERE title = ?", response.role, 
        function (err, res){
            if (err) throw err;
            roleId = res[0].id;
            connection.query(
                "INSERT INTO employees SET ?",
                {
                   first_name: response.firstname,
                   last_name: response.lastname, 
                   role_id: roleId,
                   manager: response.manager
                },
                function (err, res){
                    if (err) throw err;
                    console.log ("Employee added successfully!")
                    mainMenu();
                }
            )     
        })
    })}
