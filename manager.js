var inquirer = require("inquirer");
var database = require("./database");

var role = "manager";

function runManagerView() {
    inquirer.prompt([
        {
            name: "managerAction",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function(userInput) {
        var managerAction = userInput.managerAction;
        if (managerAction === "View Products for Sale") {
            database.viewAllItems(role, runManagerView);
        } else if (managerAction === "View Low Inventory") {
            database.viewLowInventory(runManagerView);
        } else if (managerAction === "Add to Inventory") {
            database.viewAllItems(role, promptManagerInventory);
        } else if (managerAction === "Add New Product") {
            promptManagerProduct();
        } else if (managerAction === "Quit") {
            console.log("\nThanks for using Bamazon!");
            database.connection.end();
        }
    })
}

function promptManagerInventory(products) {
    inquirer.prompt([
        {
            name: "itemId",
            type: "input",
            message: "Please enter the item ID of the product inventory you would like to update.",
            validate: function(userInput) {
                for (var i = 0; i < products.length; i++) {
                    if (userInput == products[i].item_id) {
                        return true;
                    }
                }
            
                return "Please enter a valid item ID.";
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How much inventory would you like to add to this product?",
            validate: function(userInput) {
                if (isNaN(userInput) || userInput <= 0) {
                    return "Please enter a valid quantity.";
                }

                return true;
            }
        }
    ]).then(function(userInput) {
        var itemToUpdate = products.find(function(item) {
            return item.item_id == userInput.itemId;
        })
        var newQuantity = itemToUpdate.stock_quantity + parseInt(userInput.quantity);
        database.updateProductQuantity(newQuantity, itemToUpdate.item_id, "Inventory has been updated.", runManagerView);
    })
}

function promptManagerProduct() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "Product Name:",
            validate: validateProductText
        },
        {
            name: "departmentName",
            type: "input",
            message: "Department Name:",
            validate: validateProductText
        },
        {
            name: "price",
            type: "input",
            message: "Price:",
            validate: validateProductNumber
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "Stock Quantity:",
            validate: validateProductNumber
        }
    ]).then(function(userInput) {
        database.addItem(userInput.productName, userInput.departmentName, userInput.price, userInput.stockQuantity, runManagerView);
    })
}

function validateProductText(userInput) {
    if (userInput.trim()) {
        return true;
    }

    return "This field cannot be empty.";
}

function validateProductNumber(userInput) {
    if (isNaN(userInput)) {
        return "Please enter a valid number."
    }

    return true;
}

module.exports = runManagerView;