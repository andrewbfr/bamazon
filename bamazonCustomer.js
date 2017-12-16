//Our dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

//Establishing and authorizing mysql database connection
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: "",
    database: 'bamazonDB'
  });

  //initializing connection to database
  connection.connect();

  //function to get order requests
  // work in the future to get the "quantity" question to input the previous answer's "product name" into the "mesage"
  function initiateOrder(allProducts){
      inquirer.prompt([
          {
            type: "input", 
            message: "Please enter the product's ID that you would like to order.",
            name: "productID",
            //validate straight from documentation
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
            
                // Do async stuff
                setTimeout(function() {
                    // you put the "iNaN()" into this because the documentation example didn't work for some reason
                  if (isNaN(input) || input > allProducts.length) {
                    // Pass the return value in the done callback
                    done('Please enter a valid product ID number.');
                    return;
                  }
                  // Pass the return value in the done callback
                  done(null, true);
                }, 500);
              }
          },
          {
            type: "input",
            message: "Please enter the quantity of this product you would like to order.",
            name: "orderQty",
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
            
                // Do async stuff
                setTimeout(function() {
                    // you put the "iNaN()" into this because the documentation example didn't work for some reason
                  if (isNaN(input)) {
                    // Pass the return value in the done callback
                    done('Please enter a valid quantity, an integer.');
                    return;
                  }
                  // Pass the return value in the done callback
                  done(null, true);
                }, 500);
              }
          }
          //as further validation, you could have the validation input reference the database before inquiring and make sure the value is within the range that is available, and then if the value isn't, it could say "choose a value between x & y"
          //"answers" from these prompts will deliver the two values that the user inputs in response to each "message".
          //validate the inputs as numbers
      ]).then(function(answers) {
          //"answers" is an object with two key: value, pairs
          var productID = answers.productID;
          var orderQty = answers.orderQty;
          var chosenProduct;
          //loop over products and display the chosen product (chosenProduct). only need to set chosenProduct equal to, not .push, each thing into the array because now we are only accepting a single product per order
          //remember you have to loop over the ".length" of the array of objects. 
          // allProducts is the param passed into this function. It's full, quantified value is the "results" from the connection query when this function is called and results is passed into the initiateOrder() function.
          for (var i = 0; i < allProducts.length; i++){
              if(productID == allProducts[i].ID){
                  chosenProduct = allProducts[i];
              // Two layers of conditional:
              // 1. If the validation in inquirer passes a productID value that we have in the database, do something
                    //if product chosen has sufficient quantity to fulfill the order
                    if(orderQty <= chosenProduct.stock_quantity){
                      console.log("\nUpdating stock...\n");
                      var updatedStock = chosenProduct.stock_quantity - orderQty;
                      var totalPrice = chosenProduct.price * orderQty;
                      //mega scoping issue. This works when the block of code is inside of this, but previously, chosenProduct variable was unavailable to the updateProduct() function. ....... not sure. it's working now so I'll leave it. I wonder if passing the allProducts into the updateProduct() and re-declaring chosenProduct somehow... but the allProducts[i] might also be limited. ARGHGHGHGHGH

                      var query = connection.query(
                        "UPDATE products SET stock_quantity = ? WHERE ID = ?",
                        [updatedStock, productID],
                    
                        function(err,res) {
                          console.log(`Thanks. Your ${orderQty} ${chosenProduct.product_name} have been ordered. Your order total is $${totalPrice}.`);
                          connection.end();
                        }
                      );
                    }else{
                      console.log(`\nSorry, we have ${chosenProduct.stock_quantity} ${chosenProduct.product_name} available.\n`)
                      connection.end();
                    }
              }
          }
          
      })
  };



  //update conditionals to set "have" or "has" -- been ordered, where orderQty is > or < 1.
  //commented out because it was causing scoping issues ---> not working.

  //sending queries to database & products table
  connection.query('SELECT * from products', function (error, results, fields) {
    if (error) throw error;
    //logging the available products for display
    console.log('\nThese products are available: \n' );
    // for (for each) looping over the results and displaying them legibly
    results.forEach(function (obj){
        console.log(`ID: ${obj.ID} Name: ${obj.product_name} Price: ${obj.price}\n`)
    })
    // calling the order inquirer function and passing in the product data received from the database
    initiateOrder(results);
  });
   