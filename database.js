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

function viewAllItems(role, action) {
    if (role === "customer") {
        connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(error, response) {
            if (error) throw error;
            console.log("\nItems for Sale\n");
            console.table(response);
            action(response);
        });
    } else if (role === "manager") {
        connection.query("SELECT * FROM products", function(error, response) {
            if (error) throw error;
            console.log("\nItems for Sale\n");
            console.table(response);
            action(response);
        });
    }
    
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

function updateProductSales(totalCost, itemId) {
    connection.query("UPDATE products SET product_sales = product_sales + ? WHERE item_id = ?", [totalCost, itemId], function(error, response) {
        if (error) throw error;
    });
}

function addItem(productName, departmentName, price, stockQuantity, action) {
    connection.query("INSERT INTO products SET ?", {
        product_name: productName,
        department_name: departmentName,
        price: price,
        stock_quantity: stockQuantity,
        product_sales: 0.00
    }, function(error, response) {
        if (error) throw error;
        console.log("\nProduct has been added.\n");
        action();
    })
}

function viewProductSales(action) {
    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales, (SUM(p.product_sales) - d.over_head_costs) AS total_profit FROM departments d LEFT JOIN products p ON d.department_name = p.department_name GROUP BY d.department_id, d.department_name, d.over_head_costs;", function(error, response) {
        if (error) throw error;
        console.log("\nProduct Sales\n");
        console.table(response);
        action();
    })
}

function createDepartment(departmentName, overheadCosts, action) {
    connection.query("INSERT INTO departments SET ?", {
        department_name: departmentName,
        over_head_costs: overheadCosts
    }, function(error, response) {
        if (error) throw error;
        console.log("\nDepartment has been created.\n");
        action();
    })
}

module.exports = {
    connection,
    viewAllItems,
    viewLowInventory,
    updateProductQuantity,
    updateProductSales,
    addItem,
    viewProductSales,
    createDepartment
}