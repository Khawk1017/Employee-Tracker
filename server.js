var inquirer = require('inquirer');
inquirer
  .prompt([
    {
        type: "list",
        name: "mainMenu",
        message: "What would you like to do?",
        choices: [
            'View all departments',
            'View all roles',
            'View all employess',
            'Add a department',
            'Add role',
            'Add employee',
            'Update an employee role',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'Quit'
        ],
    }
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log(answers)
  })
  