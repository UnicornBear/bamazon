var mysql = require("mysql");
var inquirer = require("inquirer");

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
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connection Successful");
//     makeTable();
// })


// create function to display table for bamazon products 
var makeTable = function(){
    connection.query("SELECT * FROM products", function(err,res){
        if(err) throw err;
        console.log("item_id\tproduct_name\tdepartment name\tprice\tnumber in stock");
        console.log("-------------------------------------------");
        for(var i=0; i<res.length; i++){
            console.log(res[i].item_id+"\t"+res[i].product_name+"\t"+
            res[i].department_name+"\t"+res[i].price+"\t"+
            res[i].stock_quantity);
        }
    console.log("-----------------------------");
    })
}

makeTable();