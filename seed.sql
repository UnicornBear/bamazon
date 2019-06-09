USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
	("Luke Skywalker Figure", "Toys", 19.99, 99),
	("Princess Leia Figure", "Toys", 19.99, 144),
	("Chewbacca Figure", "Toys", 19.99, 101),
	("Darth Vader Figure", "Toys", 19.99, 66),
	("Luke Skywalker", "Costumes", 29.99, 99),
	("Princess Leia", "Costumes", 24.99, 144),
	("Chewbacca", "Costumes", 19.99, 101),
	("Darth Vader", "Costumes", 24.99, 66),
	("Kylo Ren  Figure", "Costumes", 14.99, 181),
	("R2-D2 Remote Control Doll", "Electronics", 44.99, 33),
	("C-3PO Remote Control Doll", "Electronics", 34.99, 33),
	("Purple Lightsaber", "Toys", 19.99, 55),
	("Red Lightsaber", "Toys", 19.99, 55),
	("Green Lightsaber", "Toys", 19.99, 55),
	("White Lightsaber", "Toys", 19.99, 55),
	("Star Wars - A New Hope", "VHS", 29.99, 25),
	("Star Wars - Empire Strikes Back", "VHS", 29.99, 25),
	("Star Wars - The Last Jedi", "VHS", 29.99, 25)
;	
    
SELECT * FROM products;

INSERT INTO departments (department_name, over_head_cost)
VALUES
	("Toys",1000),
	("Costumes",1000),
	("Electronics",1000),
	("VHS",1000)
;

SELECT * FROM departments;


SELECT departments.department_name, departments.over_head_cost, products.product_sales
FROM departments
INNER JOIN products
	ON departments.department_name = products.department_name;

SELECT departments.department_name AS 'Department', 
  SUM(departments.over_head_cost) AS 'Overhead Cost', 
  SUM(products.product_sales) AS 'Total Sales' 
FROM departments
INNER JOIN products
	on products.department_name=departments.department_name
GROUP BY departments.department_name;


SELECT department_name AS 'Department', 
   SUM(departments.over_head_cost) AS 'Overhead Cost' 
FROM departments 
GROUP BY departments.department_name;	


SELECT department_name AS 'Department',
   SUM(products.product_sales) AS 'Total Sales' 
FROM products 
GROUP BY products.department_name;
