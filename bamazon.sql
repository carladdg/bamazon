DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (item_id),
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
    ("wireless headphones", "technology", 299.99, 500),
    ("iPhone X 64GB", "technology", 999.00, 150),
    ("black denim jeans", "clothing", 60.00, 300),
    ("sequin tank top", "clothing", 35.00, 750),
    ("limited edition unopened comic book", "hobbies", 3000.00, 1),
    ("5000 piece puzzle", "hobbies", 40.00, 10),
    ("home ice cream machine", "furniture", 550.25, 2),
    ("nightstand", "furniture", 100.00, 30),
    ("mattress", "furniture", 399.95, 100),
    ("'How to Win Friends and Influence People' - Dale Carnegie", "books", 15.00, 1000);