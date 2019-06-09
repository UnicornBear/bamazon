DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity DECIMAL(10,4) NULL,
  PRIMARY KEY (item_id)
);

ALTER TABLE products ADD product_sales DECIMAL(10,2) NOT NULL;


SELECT * FROM products;


CREATE TABLE departments (
department_id INTEGER(10) auto_increment NOT NULL PRIMARY KEY UNIQUE,
department_name VARCHAR(100) NOT NULL,
over_head_cost DECIMAL(10,2) NOT NULL
); 

SELECT * FROM departments;