var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//  create the connection to mySQL database
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    // login info for mySQL db
    user:"root",
    password:"3H$tal24Bear",
    // database used for app
    database:"bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    // console.log("Connection Success");
});

console.log("Welcome to Bamazon!");
start();

function start(){
    inquirer.prompt([{
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department", "Quit"]
    }]).then(function(answer) {
      switch(answer.task){

        case "View Product Sales by Department": 
            display();
            break;

        case "Create New Department": 
            addDepartment();
            break;

        case "Quit": 
            quitfun();
            break;
      }
    });
  }

// view product sales by department
function display() {
    //prints the items for sale and their details
    connection.query('SELECT * FROM departments INNER JOIN products	ON departments.department_name = products.department_name GROUP BY departments.department_name;', 
    function(err, res) {
      if(err) throw err;


      var table = new Table({
            head: ["Department ID", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"],
            colWidths: [6, 45, 16, 11, 11]
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_cost, res[i].product_sales,  (res[i].over_head_cost - res[i].product_sales)],
            );
        }
        console.log(table.toString());
        start();
    });
  };

  
  function addDepartment() {
    inquirer.prompt([{
		name: "department_name",
		type: "input",
		message: "What is the new department name?"
	}, {
		name: "over_head_cost",
		type: "input",
		message: "What are the overhead costs for this department?"
	}]).then(function(answer) {

		// Department added to departments database.
		connection.query("INSERT INTO departments SET ?", {
			department_name: answer.department_name,
			over_head_cost: answer.over_head_cost
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your department was added successfully!");
				start();
			}
		});
	});
};



  //function to quit the program
function quitfun() {
    connection.end();
};