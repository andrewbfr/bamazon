//Our dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

//Establishing and authorizing mysql database connection
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'L1ttl3.Ch13f',
    database: 'bamazonDB'
  });

  //initializing connection to database
  connection.connect();

  //function to get order requests
  // work in the future to get the "quantity" question to input the previous answer's "product name" into the "mesage"
  //\nPlease enter a valid product ID number.
  function initiateOrder(allProducts){
      inquirer.prompt([
          {
            type: "input", 
            message: "Please enter the product's ID that you would like to order.",
            name: "produtID",
            //validate straight from documentation
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
            
                // Do async stuff
                setTimeout(function() {
                    // you put the "iNaN()" into this because the documentation example didn't work for some reason
                  if (isNaN(input)) {
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
                    done('Please enter a valid product ID number.');
                    return;
                  }
                  // Pass the return value in the done callback
                  done(null, true);
                }, 500);
              }
          }
          //"answers" from these prompts will deliver the two values that the user inputs in response to each "message".
          //validate the inputs as numbers
      ]).then(function(answers) {
          console.log(answers);
          var productID = answers.productID;
          var orderQty = answers.orderQty;
          var chosenProduct;
          //loop over products and display the chosen product (chosenProduct). only need to set chosenProduct equal to, not .push, each thing into the array because now we are only accepting a single product per order
          for (var i = 0; i < allProducts; i++){
              if(productID == allProducts[i].ID){
                  console.log(productID);
                  chosenProduct = allProducts[i];
              }
          }

      })

  };

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
   
  connection.end();