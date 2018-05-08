var inquirer = require("inquirer");
var database = require("./database");

var role = "customer";

function runCustomerView() {
    database.viewAllItems(role, promptCustomerPurchase);
}

function promptCustomerPurchase(products) {
    inquirer.prompt([
        {
            name: "itemId",
            type: "input",
            message: "What is the item ID of the product you would like to buy?",
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
            message: "How many would you like to buy?",
            validate: function(userInput) {
                if (isNaN(userInput) || userInput <= 0) {
                    return "Please enter a valid quantity.";
                }

                return true;
            }
        }
    ]).then(function(userInput) {
        var itemToPurchase = products.find(function(item) {
            return item.item_id == userInput.itemId;
        })
        
        if (userInput.quantity > itemToPurchase.stock_quantity) {
            console.log(`\nSorry, there is an insufficient quantity of ${itemToPurchase.product_name} to fulfill your order. Please try again.\n`);
            promptCustomerPurchase(products);
        } else {
            var totalCost = (itemToPurchase.price * userInput.quantity).toFixed(2);
            console.log(`\nYour total for ${userInput.quantity} ${itemToPurchase.product_name} is $${totalCost}.\n`)
            confirmOrder(totalCost, itemToPurchase.stock_quantity, userInput.quantity, itemToPurchase.item_id);
        }
    })
}

function confirmOrder(totalCost, stockQuantity, purchaseQuantity, itemId) {
    inquirer.prompt([
        {
            name: "confirmPurchase",
            type: "confirm",
            message: "Are you sure you would like to place this order?"
        }
    ]).then(function(userInput) {
        if (userInput.confirmPurchase) {
            var newQuantity = stockQuantity - purchaseQuantity;
            database.updateProductSales(totalCost, itemId);
            database.updateProductQuantity(newQuantity, itemId, "Your order has been completed.", purchaseAgain);
        } else {
            console.log("\nYour order has been canceled.\n");
            purchaseAgain();
        }
    })
}

function purchaseAgain() {
    inquirer.prompt([
        {
            name: "purchaseAgain",
            type: "confirm",
            message: "Would you like to make another purchase?"
        }
    ]).then(function(userInput) {
        if (userInput.purchaseAgain) {
            runCustomerView(database.connection);
        } else {
            console.log("\nThanks for using Bamazon!");
            database.connection.end();
        }
    })
}

module.exports = runCustomerView;