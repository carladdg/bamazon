var inquirer = require("inquirer");
var database = require("./database");

function runSupervisorView() {
    inquirer.prompt([
        {
            name: "supervisorAction",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
    ]).then(function(userInput) {
        var supervisorAction = userInput.supervisorAction;
        if (supervisorAction === "View Product Sales by Department") {
            database.viewProductSales(runSupervisorView);
        } else if (supervisorAction === "Create New Department") {
            promptSupervisorDepartment();
        } else if (supervisorAction === "Quit") {
            console.log("\nThanks for using Bamazon!")
            database.connection.end();
        }
    })
}

function promptSupervisorDepartment() {
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "Department Name:", 
            validate: function(userInput) {
                if (userInput.trim()) {
                    return true;
                }
            
                return "This field cannot be empty.";
            }
        },
        {
            name: "overheadCosts",
            type: "input",
            message: "Overhead Costs:",
            validate: function(userInput) {
                if (isNaN(userInput)) {
                    return "Please enter a valid number."
                }
            
                return true;
            }
        }
    ]).then(function(userInput) {
        database.createDepartment(userInput.departmentName, userInput.overheadCosts, runSupervisorView);
    })
}

module.exports = runSupervisorView;