var inquirer = require("inquirer");

var runCustomerView = require("./customer");
var runManagerView = require("./manager");

function mainMenu() {
    console.log("\nWelcome to Bamazon!\n");
    inquirer.prompt([
        {
            name: "userType",
            type: "list",
            message: "Please select your user type.",
            choices: ["Customer", "Manager", "Supervisor"]
        }
    ]).then(function(userInput) {
        var userType = userInput.userType;
        if (userType === "Customer") {
            runCustomerView();
        } else if (userType === "Manager") {
            runManagerView();
        } else if (userType === "Supervisor") {

        }
    })
}

mainMenu();