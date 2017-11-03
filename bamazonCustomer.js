var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  
  user: "root",

  
  password: "1234",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the display inventory function after the connection is made to prompt the user
  // displayInventory();

  displayInventory();

  // postAuction();
});

function postAuction() {
  // prompt for info about the item being queried
   inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "What is the item id?"
      },
      {
        name: "amount",
        type: "input",
        message: "How many would you like to buy?",
      
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
    		connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item_id }, function(err, res) {
    	    
          if (err) throw err;
          if (res.length === 0) {
          console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
          //displayInventory();
        }else{
          var itemAmt = res[0].stock_quantity;

          var amount = parseInt(answer.amount);
          

          if(amount <= parseInt(itemAmt)){
            console.log("We have these in stock");

            var remaining = itemAmt - amount;

            console.log(remaining);

            var update_items = [remaining, answer.item_id];

           connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", update_items,
            function(err,res){
              console.log("Item updated!!!");
            })

            console.log("Your total is " + res[0].price * answer.amount)
          }
        }
      })
  })
}
      









function displayInventory(){
  // query the database for all items 
  connection.query("SELECT * FROM products", function(err, results) {
     if (err) throw err;
        for (var i = 0; i < results.length; i++) {
           console.log("Item ID: " + results[i].item_id + " || Product Name: " + results[i].product_name + 
            " || Price: " + results[i].price);
        }
        postAuction();  
  });
}
  














//inquirer What is the item ID? How many would you like?
//if not enough in stock console.log insuffiecient quantity
//else subtract amount by number in stock and console log receipt