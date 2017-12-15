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
        //   console.log(answers);
          var productID = answers.productID;
          var orderQty = answers.orderQty;
          var chosenProduct;
          //loop over products and display the chosen product (chosenProduct). only need to set chosenProduct equal to, not .push, each thing into the array because now we are only accepting a single product per order
          //remember you have to loop over the ".length" of the array of objects. 
          // allProducts is the param passed into this function. It's full, quantified value is the "results" from the connection query when this function is called and results is passed into the initiateOrder() function.
          for (var i = 0; i < allProducts.length; i++){
              if(productID == allProducts[i].ID){
                  console.log(productID);
                  chosenProduct = allProducts[i];
              }
          }
          console.log(productID);
          console.log(orderQty);
          console.log(chosenProduct);
          // Two layers of conditional:
          // 1. If the validation in inquirer passes a productID value that we have in the database, do something
          if(chosenProduct !== undefined){
            //if product chosen has sufficient quantity to fulfill the order
            if(orderQty < chosenProduct.stock_quantity){
                
            }
            

          }
          // and later
          //2. If the product id is actually present

          // if the validation in inquirer allows a number, but it is a number corresponding to a nonexistent product
          else{
            console.log("Sorry, this product ID does not exist in our database.")
            connection.end();
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