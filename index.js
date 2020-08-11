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
    inquirer.prompt({
        
    })
}