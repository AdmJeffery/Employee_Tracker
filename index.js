const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


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
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee Role",
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

            
            case "EXIT":
                console.log("Goodbye!");
                connection.end();
        }   

    })
}

function viewEmployees(){

    var searchAll = "SELECT first_name, last_name, title, salary, manager_id FROM employees LEFT JOIN roledb ON employees.role_id = roledb.id"
    connection.query(searchAll, function (err, res){
        if (err) throw err;
        
        
        console.table(res)
        mainMenu();

    })
}

function viewRoles(){
    let searchRoles = "SELECT roledb.id, title, salary, departments.id, departments.dept_name AS departments FROM roledb";
    searchRoles += " LEFT JOIN departments ON roledb.department_id = departments.id ";

    connection.query(searchRoles, function (err, data){
        if (err) throw err;
        
        console.log(` ${data.length} roles currently listed`)
        console.table(data);
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
    inquirer.prompt({
        type: "confirm",
      name: "checking",
      message: "Does this Employee have a manager?",
    })
    .then((response) => {
        if (response.checking) {
          
          yesManager();
        } else {
          
          noManager();
        }
      });
    
    
    }

function noManager(){
    let roles = {};
    
    connection.query("SELECT * FROM roledb", (err, roles_data) => {
      for (var i = 0; i < roles_data.length; i++) {
        let role = roles_data[i];
        roles[role.title] = role.id;
      }
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter the Employee's first name",
            
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter the Employee's last name",
            
          },
          {
            type: "list",
            name: "role",
            message: "What is the Employee's role?",
            choices: Object.keys(roles),
          },
        ])
        .then(async (response) => {
          
          buildEmployee(response, roles[response.role]);
        });
    });
}

function yesManager() {
    
    let roles = {};
    let managers = {};
    
    connection.query("SELECT * FROM roledb", (err, roles_data) => {
      for (var i = 0; i < roles_data.length; i++) {
        let role = roles_data[i];
        roles[role.title] = role.id;
      }
      
      connection.query("SELECT * FROM employees", (err, employees_data) => {
        for (var i = 0; i < employees_data.length; i++) {
          let worker = employees_data[i];
          managers[` ${worker.first_name} ${worker.last_name},`] = worker.id;
        }
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "Enter the Employee's first name",
              
            },
            {
              type: "input",
              name: "last_name",
              message: "Enter the Employee's last name",
              
            },
            {
              type: "list",
              name: "role",
              message: "What is the Employee's role?",
              choices: Object.keys(roles),
            },
            {
              type: "list",
              name: "manager_id",
              message: "Who is the Employee's manager?",
              choices: Object.keys(managers),
            },
          ])
          .then(async (response) => {
            
            buildEmployee(
              response,
              roles[response.role],
              managers[response.manager_id]
            );
          });
      });
    });
  }

  function buildEmployee(response, roleId, managerId) {
    console.log("Creating the profile for a new employee...\n");
    connection.query(
      "INSERT INTO employees SET ?",
      {
        first_name: response.first_name,
        last_name: response.last_name,
        role_id: roleId,
        manager_id: managerId,
      },
      function (error, res) {
        if (error) throw error;
        
        console.log("Employee added successfully \n");
        mainMenu();
      }
    );
  }

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

