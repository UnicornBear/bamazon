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