const mysql = require("mysql")
const inquirer = require("inquirer")

//  create the connection to mySQL database
const connection = mysql.createConnection({
    host: "localhost",
    port: 8080,
    // login info for mySQL db
    user: "root",
    password: "3H$tal24Bear",
    // database used for app
    database: "bamazon"
});

// connect to mySQL 
connection.connect(function(err) {
    if (err) throw err
    
});

