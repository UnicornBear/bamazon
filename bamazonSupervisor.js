var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//  create the connection to mySQL database
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    // login info for mySQL db
    user:"root",
    password:"1Password!324",
    // database used for app
    database:"bamazon"
})

// connection if error throw error
connection.connect(function (err) {
    if (err) throw err;
});

console.log("Welcome to Bamazon - Supervisor!");
start();

function start(){
    inquirer.prompt([{
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: ["View Departments", "View Product Sales by Department", "Create New Department", "Quit"]
    }]).then(function(answer) {
      switch(answer.task){

        case "View Departments": 
            displayDepartments();
            break;

        case "View Product Sales by Department": 
            display();
            break;

        case "Create New Department": 
            addDepartment();
            break;

        case "Quit": 
            quit();
            break;
        }
    });
}

// create function to display table for bamazon departments & products 
function displayDepartments() {
    // query products and departments to report sales
    connection.query("SELECT * FROM departments", 
    function(err, res) {    
      if(err) throw err;
      
        // display table using cli-table
        var table = new Table({
            head: ["Department ID", "Department Name", "Over Head Costs"],
            colWidths: [6, 45, 16]
        });
        // loop through and report all possible values for all fields
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_cost],
            );
        }
        console.log(table.toString());
        start();
    });
};

// create function to display table for bamazon departments & products 
function display() {
    // query products and departments to report sales
    connection.query("SELECT * FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name", 
    function(err, res) {    
      if(err) throw err;
      
        // display table using cli-table
        var table = new Table({
            head: ["Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"],
            colWidths: [6, 45, 16, 11, 11]
        });
        // loop through and report all possible values for all fields
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_cost, res[i].product_sales,  (res[i].product_sales - res[i].over_head_cost)],
            );
        }
        console.log(table.toString());
        start();
    });
};

// function to add a new Department   
function addDepartment() {
    // prompt inquirer
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is the new department name?"
        }, {
            type: "input",
            name: "over_head_cost",
            message: "What are the overhead costs for this department?"
        }
    // function for supplied answers    
    ]).then(function(answer) {
		// query to input answers into products table
        connection.query("INSERT INTO departments SET ?", 
        [{
			department_name: answer.department_name,
			over_head_cost: answer.over_head_cost
        }], 
        // function if error else department is added
        function(err) {
            if (err) throw err;
                // show message that the department has been added
				console.log("Your department was added successfully!");
				start();
		});
	});
};  

// function to quit the program
function quit() {
    connection.end();
};
