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
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection Successful");
    makeTable();
})

// create function to display table for bamazon products 
var makeTable = function(){
    connection.query("SELECT * FROM products", function(err,res){
        for(var i=0; i<res.length; i++){
            console.log(res[i].item_id+" | "+res[i].product_name+" | "+
            res[i].department_name+" | "+res[i].price+" | "+
            res[i].stock_quantity+"\n");
        }
    askCustomer(res);
    })
}

var askCustomer = function(res){
    inquirer.prompt([{
        type:'input',
        name:'choice',
        message:"Hello, what would you like to purchase?"
    }]).then(function(answer){
        var correct = false;
        if(answer.choice.toUpperCase()=="Q"){
            process.exit();
        }
        for(var i=0;i<res.length;i++){
            if(res[i].product_name==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                inquirer.prompt({
                    type:"input",
                    name:"quant",
                    message:"How many would you like to purchase?",
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stock_quantity-answer.quant)>0){
                        connection.query("UPDATE products SET stock_quantity='"+
                        (res[id].stock_quantity-answer.quant)+
                        "' WHERE product_name='"+product+"'", 
                    function(err,res2){
                        console.log("You Purchased the Product");
                        makeTable();
                        })
                    } else {
                        console.log("Not a Valid Purhcase!");
                        askCustomer(res);
                    }
                })
            }
        }
        if(i==res.length && correct==false){
            console.log("This is not a valid selection");
            askCustomer(res);
        }
    })
}