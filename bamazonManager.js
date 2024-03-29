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

console.log("Welcome to Bamazon - Manager!");
start();


//function at the beginning to prompt questions.
function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "task",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function (answer) {
        //use switch/case for different functions to run based on different answers.
        switch (answer.task) {
        
            case "View Products for Sale":
                display();
                break;

            case "View Low Inventory":
                viewLowInv();
                break;

            case "Add to Inventory":
                addInv();
                break;

            case "Add New Product":
                addProduct();
                break;

            case "Quit":
                quit();
                break;                
        }
    });
}


//function to "View Products for Sale". Select table from Database and display the table using cli-table.
function display() {
    // query database to show all products
    connection.query("SELECT * FROM products", 
    function (err, res) {
        if (err) throw err;

        // display table using cli-table
        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Qty", "Product Sales"],
            colWidths: [6, 45, 16, 11, 11, 16]
        });
        // loop through and report all possible values for all fields
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales], 
            );
        }
        console.log(table.toString());
        start()
    });
};


//function to View Low Inventory.
function viewLowInv() {
    // query database to show products when <=10
    connection.query("SELECT * FROM products WHERE stock_quantity <= 10", 
    function(err, res){
        if (err) throw err;

        // display table using cli-table
        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Qty", "Product Sales"],
            colWidths: [6, 45, 16, 11, 11, 16]
        });
        // loop through and report all possible values for all fields
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales], 
            );
        }
        console.log(table.toString());
        start()
    })
};


// function to Add to Inventory
function addInv() {
    //prompt questions to get selected item id and quantity
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "What is the ID of the item you would like to add more quantity?",
            //users need to enter number
            validate: function(inputID) {
                if (!isNaN(inputID)) {
                    return true;
                }
                // ask to enter a valid itemID
                console.log("Please enter a valid ID.");
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to add to the inventory?",
            //users need to enter number
            validate: function(inputQ) {
                if (!isNaN(inputQ)) {
                    return true;
                }
                // ask to enter a valid quantity number
                console.log("Please enter a valid quantity.");
                return false;
            }
        }
    ]).then(function (answer) { 
        
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
        
            //if users enter an item ID outside total items range, then throw error message.
            if((parseInt(answer.itemID)>res.length) || (parseInt(answer.itemID)<=0)) {
                console.log("Please enter a valid ID.");
            }

            //otherwise, proceed to loop through the data and find matched item id as the selected item
            var chosenItem ="";
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.itemID)) {
                chosenItem = res[i];
                }
            }
            
            //update the quantity for selected item id
            connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: chosenItem.stock_quantity += parseInt(answer.quantity)
                },{
                    item_id: chosenItem.item_id   
                }],
                function(err) {
                    if (err) throw err;
                    //show message that certain product and its quantity has been updated in the inventory.
                    console.log("Successfully updated/added "+ answer.quantity + " " + chosenItem.product_name + " to the inventory.");
                    display();
                });
        });
    });
};


//function to Add New Product
function addProduct() {
    //prompt questions to get product name, department, cost, and quantity for the new product 
    inquirer.prompt([
        {
            type: "input",
            name: "newProductName",
            message: "What is the name of the product you would like to add?"
        },
        {
            type: "list",
            // type: "input",
            name: "department",
            message: "Which department does this product fall into?",
            choices: ["Toys", "Costumes", "Electronics", "Toys", "VHS"] 
        },
        {
            type: "input",
            name: "cost",
            message: "How much does it cost?",
            validate: function(cost) {
                if (!isNaN(cost)) {
                    return true;
                }
                console.log("Please enter a valid cost.");
                return false;
            }
        },
        {
            type: "input",
            name: "newQuantity",
            message: "How many do we have?",
            validate: function(newQuantity) {
                if (!isNaN(newQuantity)) {
                    return true;
                }
                console.log("Please enter a valid quantity.");
                return false;
            }
        }
    // function to use the answers
    ]).then(function (answers){
        // query to input answers into products table
        connection.query("INSERT INTO products SET ?", 
        [{  product_name: answers.newProductName,
            department_name: answers.department,
            price: answers.cost,
            stock_quantity: answers.newQuantity,
            product_sales: 0
        }], 
        // function if error else product has been added
        function(err) {
            if (err) throw err;
            //show message that the product has been added.
            console.log(answers.newProductName + " has been added to Bamazon.\n");
            display();
        });     
    });
};  


//function to quit the program
function quit() {
    connection.end();
};  
