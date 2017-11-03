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
});

function selection() {
  console.log("");
  inquirer.prompt([
    {
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
      name: "action"
    },
  ]).then(function (user) {
    switch(user.action) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        viewLow();
        break;
      case "Add to Inventory":
        add();
        break;
      case "Add New Product":
        addNew();
        break;
      case "Exit":
        exit();
        break;
    }
  });
}


function viewProducts(){
	connection.query("SELECT * FROM products", function(err, results) {
     if (err) throw err;
        for (var i = 0; i < results.length; i++) {
           console.log("Item ID: " + results[i].item_id + " || Product Name: " + results[i].product_name + 
            " || Price: " + results[i].price);
        }
        selection();
  });
}

function viewLow(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
     if (err) throw err;
        for (var i = 0; i < results.length; i++) {
           console.log("Item ID: " + results[i].item_id + " || Product Name: " + results[i].product_name + 
            " || Price: " + results[i].price + " || Quantity " + results[i].stock_quantity);
        }
        selection();
  });
}

function add(err,res){
	inquirer
    .prompt([
      {
        name: "additem_id",
        type: "input",
        message: "What is the item id of the product you wish to add?"
      },
      {
        name: "addamount",
        type: "input",
        message: "How many would you like to add?",
      
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var quantity = res[0].stock_quantity;
      console.log(quantity);
    	var newAmount = parseInt((quantity) + parseInt(answer.addamount));
    	connection.query("UPDATE PRODUCTS SET ? WHERE ?", [
    	{
    		stock_quantity: newAmount
    	},
    	{
    		item_id: answer.additem_id
    	}
    	]),
    	function(error) {
              if (error) throw err;
              console.log("You have successfully update the quantity");
            }
          
        });
}


function addNew(err,res) {
	inquirer.prompt([
	{
		type: "input",
		message: "What is the product name?",
		name: "itemName"
	},
	{
		type: "input",
		message: "What department is it in?",
		name: "itemDepartment"
	},
	{
		type: "number",
		message: "What is it's price?",
		name: "itemPrice"
	},
	{
		type: "number",
		message: "How many do we have of this product?",
		name: "itemQuantity"
	},
	]).then(function (answer) {
		connection.query("INSERT INTO products SET ?", {
			product_name: answer.itemName,
			department_name: answer.itemDepartment,
			price: answer.itemPrice,
			stock_quantity: anwers.itemQuantity
		}, function(err, res) {
			if(err) throw err;

			console.log("\nYour product has been added!\n");
			selection();
		});
	});
}

function exit() {
  connection.end();
  console.log("Good Bye!");
}

selection();