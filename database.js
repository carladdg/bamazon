var mysql = require("mysql");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(error) {
    if (error) throw error;
});

function viewAllItems(action) {
    connection.query("SELECT * FROM products", function(error, response) {
        if (error) throw error;
        console.log("\nItems for Sale\n");
        console.table(response);
        action(response);
    });
}

function viewLowInventory(action) {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, response) {
        if (error) throw error;
        console.log("\nItems with Low Inventory\n");
        console.table(response);
        action();
    });
}

function updateProductQuantity(newQuantity, itemId, message, action) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, itemId], function(error, response) {
        if (error) throw error;
        console.log(`\n${message}\n`);
        action();
    });
}

function addItem(productName, departmentName, price, stockQuantity, action) {
    connection.query("INSERT INTO products SET ?", {
        product_name: productName,
        department_name: departmentName,
        price: price,
        stock_quantity: stockQuantity
    }, function(error, response) {
        if (error) throw error;
        console.log("\nProduct has been added.\n");
        action();
    })
}

module.exports = {
    connection,
    viewAllItems,
    viewLowInventory,
    updateProductQuantity,
    addItem
}