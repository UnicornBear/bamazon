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

// connect to mySQL 
connection.connect(function(err) {
    if (err) throw err;
    // console log to check if successful connection
    // console.log("Connection Successful");
})

console.log("Welcome Customer, to Bamazon!")
display();


// create function to display table for bamazon products 
function display(){
    connection.query("SELECT * FROM products", 
    function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ["ID", "Product Name", "Department", "Price", "Stock Qty"],
            colWidths: [6, 45, 16, 11, 11]
        });
        
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity],
            );
        }
        console.log(table.toString());
        start();
    })
}


//function to start interaction with Customer
function start() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "What is the ID of the item you would like to purchase? [Quit with Q]",
            validate: function(inputID) {
                //if users enter q or Q, exit the program.
                if (inputID.toLowerCase() === "q") {
                    connection.end();
                    process.exit();
                }
                //users need to enter a number between 1 to 10 because there are 10 items in the table.
                else if ((!isNaN(inputID)) && (inputID<=10) && (inputID>0)) {
                    return true;
                }
                console.log("Please enter a valid ID.");
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like? [Quit with Q]",
            validate: function(inputQ) {
                //if users enter q or Q, exit the program.
                if (inputQ.toLowerCase() === "q") {
                    connection.end();
                    process.exit();
                }
                //users need to enter a number
                else if (!isNaN(inputQ)) {
                    return true;
                }
                console.log("Please enter a valid quantity.");
                return false;
            }
        }
    ]).then(function (answer) {

        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            //query through out the table to find the matched ID as the selected item.
            var chosenItem ="";
              for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.itemID)) {
                  chosenItem = res[i];
                }
              }
              
              //check if the inventory has enough of the product to meet the customer's request.
              //if it has enough of the product, update the SQL database to reflect the remaining quantity
              if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: chosenItem.stock_quantity-= parseInt(answer.quantity)
                    },
                    {
                      item_id: chosenItem.item_id
                    }
                  ],
                  function(error) {
                    if (error) throw err;
                    //Once the update goes through, show the customer the total cost of their purchase.
                    var totalCost = answer.quantity * chosenItem.price;
                    console.log("Thank you. Successfully purchased "+ answer.quantity + " " + chosenItem.product_name + ".");
                    console.log("Your total cost is $"+ totalCost + ".");
                    display();
                  }
                );
              }
              else {
                //show error message when inventory is not sufficient to prevent the order from going through.
                console.log("Sorry. Insufficient quantity! Please select another item or change your quantity.");
                start();
              }
            });
    });

}



//OLD QUERY 

// create function to interact with the customer
// function askCustomer(res){
//     inquirer.prompt([{
//         type:'input',
//         name:'choice',
//         message:"Hello, what would you like to purchase?"
//     }]).then(function(answer){
//         var correct = false;
//         //if customer chooses 'Q' - then exit app process
//         if(answer.choice.toUpperCase()=="Q"){
//             process.exit();
//         }
//         for(var i=0;i<res.length;i++){
//             if(res[i].product_name==answer.choice){
//                 correct=true;
//                 var product=answer.choice;
//                 var id=i;
//                 inquirer.prompt({
//                     type:"input",
//                     name:"quant",
//                     message:"How many would you like to purchase?",
//                     validate: function(value){
//                         if(isNaN(value)==false){
//                             return true;
//                         } else {
//                             return false;
//                         }
//                     }
//                 }).then(function(answer){   
//                     if((res[id].stock_quantity-answer.quant)>0){
//                         connection.query("UPDATE products SET stock_quantity='"+
//                         (res[id].stock_quantity-answer.quant)+
//                         "' WHERE product_name='"+product+"'", 
//                     function(err,res2){
//                         console.log("You Purchased the Product");
//                         makeTable();
//                         })
//                     } else {
//                         console.log("Not a Valid Purhcase!");
//                         askCustomer(res);
//                     }
//                 })
//             }
//         }
//         if(i==res.length && correct==false){
//             console.log("This is not a valid selection");
//             askCustomer(res);
//         }
//     })
// }