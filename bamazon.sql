DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

DROP TABLE IF EXISTS products;
 USE bamazonDB;
 
CREATE TABLE products(
ID INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(45) NOT NULL,
department_name VARCHAR(45) NOT NULL,
price INTEGER(45) NOT NULL,
stock_quantity INTEGER(45) NOT NULL,
PRIMARY KEY (ID)
);

-- as an example, here is the first product in sports_essentials. The rest follow this type.


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("skis", "sports_essentials", 100, 1000);;

