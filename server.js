// Importing the database connection module and inquirer
const inquirer = require('inquirer');
const connection = require('./db/connection');

// Defining function to retrieve all departments from the database
function viewAllDepartments() {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        console.table(results);
        main();
    });

}

// Defining function to retrieve all roles from the database
function viewAllRoles() {
    connection.query("SELECT * FROM roles", (err, results) => {
        if (err) throw err;
        console.table(results);
        main();
    });
}

// Defining function to retreive all employees form the database 
function viewAllEmployees() {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        console.table(results);
        main();
    });
}

// Define a function to add a new department to the database
  function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of your department?"
        }
    ]).then((answer) => {
        const departmentName = departmentName;
        connection.query("INSERT INTO department (department_name) VALUES (?)",
            [departmentName],
            (err, res) => {
                if (err) throw err;
                console.log(`Department ${departmentName} has been added to the database`);
                //  Call the main menu prompt again
                main();
            }
        );
    })
}

// Function to add a new role to the database
  function addRole() {
    // Prompt the user for the new role details
     inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is thr title of the new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the new role?",
            validate: (value) => {
                //  Validate that the salary is a number
                const valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number";
            }
        },
        {
            type: "list",
            name: "department",
            message: "Which department does the new role role belong to?",
            choices: departmentChoices
        }
    ]).then((answer) => {
        const title = answer.title;
        const salary = answer.salary;
        const department_id = departmentMap[answer.department];
        connection.query(
            "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
            [title, salary, department_id],
            (err, res) => {
                if (err) throw err;
                console.log(`Role ${title} has been added to the database.`);
                // call the main menu prompt again
                main();
            }
        );
    });
}

// Function to add a new employee to the database
  function addEmployee() {
    // Promot the user for the new employee details
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the first name of the employee?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the last name of the new employee?"
        },
        {
            type: "list",
            name: "manager",
            messgae: "Who is the manager of the new employee?",
            choices: employeeChoices
        }
    ]).then((answer) => {
        const firstName = answer.firstName;
        const lastName = answer.lastName;
        const role_id = roleMap[answer.role];
        const manager_id = employeeMap[answer.manager];
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?,)",
            [firstName, lastName, role_id, manager_id],
            (err, res) => {
                if (err) throw err;
                console.log(`Employee ${firstName} ${lastName} has been added to the database. `);
                //  Call the main menu prompt 
                main();
            }
        );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    // inquirer prompts for employee and role details
      inquirer.prompt([
        {
            name: 'employeeId',
            type: 'input',
            message: 'Enter the ID of the employee you want to update:',
            validate: validateNumberInput,
        },
        {
            name: 'roleId',
            type: 'input',
            message: 'Enter the ID of the new role for the employee',
            validate: validateNumberInput,
        },
    ]).then((answers) => {
        // update the employee's role in the database
        const { employeeId, roleId } = answers;
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const values = [roleId, employeeId];
        connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log(`Successfully updated employee ${employeeId} with role ${roleId}`);
            // Return to the main menu
            main();
        });
    });
}

// Function to delete a department from the database
  function deleteDepartment() {
    // Query the database for all departments
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        // Prompt the user to select a department to delete
        inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                message: 'Which department would you like to delete?',
                choices: res.map(department => department.department_name)
            },
            {
                name: 'confirm',
                type: 'confirm',
                message: 'Are you sure you want to delete this department?',
                default: false
            }
        ]).then(answers => {
            if (answers.confirm) {
                // Delete the department from the database
                connection.query(
                    'DELETE FROM department WHERE department_name = ?'
                    [answers.department],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Department '${answers.department}' deleted sucessfully.`);

                    }
                );
            } else {
                console.log('Department not deleted.');
            }
        });
    });
}

// Connect to the database and call the deleteDepartment function
// connection.connect(err => {
//     if (err) throw err;
//     console.log(`Connected to database as id ${connection.threadId}`);
//     deleteDepartment();
// });

// Function to delete an employee from the database
function deleteEmployee() {
    // query the database to get a list of all employee names
    const employeeNames = results.map((result) => `${result.first_name} ${result.last_name}`);

    //  prompt the user for the employee to delete
    inquirer
        .prompt([
            {
                type: "list",
                name: "employeeToDelete",
                message: "Which employee would you like to delete?",
                choices: employeeNames,
            },
        ])
        .then((answers) => {
            // Get the id of the employee to delete
            const employeeIdToDelete = results.find(
                (result) => `${result.first_name} ${result.last_name}` === answers.employeeIdToDelete
            ).id;

            // Delete the employee from the database
            connection.query(
                "DELETE FROM employee WHERE id = ?",
                [employeeIdToDelete],
                function (err, results) {
                    if (err) throw err;

                    console.log(`Deleted employee "${answers.employeeToDelete}" from the database.`);
                    main();
                }
            );
        });
}
function deleteRole() {
    connection.query('SELECT * FROM roles', (err, roles) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'roleToDelete',
                    message: 'Which role would you like to delete?',
                    choices: roles.map((role) => role.title),
                },
            ])
            .then((answer) => {
                const roleToDelete = roles.find((role) => role.title === answer.roleToDelete);

                connection.query('DELETE FROM roles WHERE id = ?', [roleToDelete.id], (err, result) => {
                    if (err) throw err;
                    console.log(`Successfully deleted ${answer.roleToDelete} role!`);
                    main();
                });
            });
    });
}

main();

function main(){
inquirer
    .prompt([
        {
            type: "list",
            name: "mainMenu",
            message: "What would you like to do?",
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
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
        switch (answers.mainMenu) {
            case 'View all departments':
                viewAllDepartments();
                break
            case 'View all roles':
                viewAllRoles();
                break
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete a employee':
                deleteEmployee();
                break;
            case 'Quit':
                connection.end();
                console.log('Goodbye!');
                break;
            default:
                console.log('Invalid choice.');
                break;


        }
    });
}