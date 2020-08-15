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
            "Add Role",
            "Add Department",
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
                console.log("Coming Soon")    
                mainMenu();
                break;

            case "Add Employee":
                   
                addEmployee();
                break;
            
            case "Add Role":
                
                addRole();
                break;
            
            case "Add Department":
                    
                addDepartment();
                break;

            case "Update Employee Role":
                   
                updateRole();
                break;

            case "Update Employee Manager":
                console.log("Coming Soon")    
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
            
        }
        console.table(roledbInfo);
            mainMenu();
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
            
        }
        console.table(depts);
            mainMenu();
    })
}

function addEmployee(){
    const roles = [];
    connection.query("SELECT title FROM roledb", function (err, res){
    if (err) throw err;
    
    for (i=0; i<res.length; i++){
        roles.push(res[i].title)
    }
});
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

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "deptname",
                message: "Enter the name of the Department that you would like to add."
            
            }
        ]) .then (response =>{
            
            connection.query("INSERT INTO departments SET ?",
                {
                    dept_name: response.deptname
                }, 
                function (err, res){
                    if (err) throw err;
                    console.log("Department added successfully")
                    mainMenu();
                }
            )
        })
}

function addRole(){
    let departments = [];
    connection.query("SELECT * FROM departments", (err, departments_data) => {
        for (var i=0; i<departments_data.length; i++) {
            departments.push(departments_data[i].dept_name)
        }
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new Role.",
                },
                {
                    type: "input",
                    name:"salary",
                    message: "Enter the salary for this role."
                },
                {
                    type:"list",
                    name: "department",
                    message:"What is this Role's department id?",
                    choices: departments

                }
            ])
            .then( (response) => {
                let deptId;
                connection.query(
                    "SELECT id FROM departments WHERE dept_name = ?", response.department, function(err, depart){
                        if (err) throw err;
                        console.log(depart)
                        console.log(`RESPONSE: ${depart}`)
                        deptId = depart[0].id;

                        connection.query(
                            "INSERT INTO roledb SET ?",
                            {
                                title: response.title,
                                salary: response.salary,
                                department_id: deptId,
                            },
                            function (error, res) {
                                if (error){
                                    throw error;
                                }
                                console.log("Role added successfully")
                                mainMenu();
                            }
                        );
                    }
                )
                
                
            });
    });
}

function updateRole(){
    const currentEmployees = [];
    connection.query("SELECT * FROM employees", function(err, res){
        if (err) throw err;
        for (i=0; i<res.length; i++) {
            currentEmployees.push(res[i].first_name + " "  + res[i].last_name);
        }
        inquirer
            .prompt([
                {
                    type:"list",
                    name:"chosenone",
                    message:"Which employee would you like to update?",
                    choices: currentEmployees
                },
                {
                    type: "list",
                    name: "newRole",
                    message: "Select the new role for this employee",
                    choices: roles
                }
            ]).then (response => {
                connection.query("SELECT * FROM employees", function (err, res){
                    if (err) throw (err)
                    let selectedEmployee = res.filter(employees => response.chosenone === employees.first_name + " " + employees.last_name);
                    employeeId = selectedEmployee[0].id;
                    

                    connection.query("SELECT * FROM roledb", function (err, result){
                        if (err) throw err;
                        let newRoleId = result.filter(employees => response.newRole === employees.title)[0].id;
                        

                        connection.query(
                            "UPDATE employees SET ? WHERE ?",
                            [
                                {
                                    role_id: newRoleId
                                },
                                {
                                    id: employeeId
                                }
                            ],
                            function (error, res){
                                if (error) throw error;
                                console.log("Employee role updated!");
                                mainMenu();
                            }
                        )
                    }
                )})
            })
    })
}