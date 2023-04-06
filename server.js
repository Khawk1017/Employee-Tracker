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
let departmentChoices = [];

function getDepartments() {
  const query = "SELECT department_name FROM department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    // Map the department names to an array of choices
    departmentChoices = res.map((department) => department.department_name);
  });
}

// Call getDepartments() to populate departmentChoices with department names
getDepartments();

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
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "What is the name of your department?",
          validate: function (value) {
            // Check that the department name is not empty
            if (value.trim().length === 0) {
              return "Please enter a department name";
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const departmentName = answers.departmentName;
        connection.query(
          "INSERT INTO department (department_name) VALUES (?)",
          [departmentName],
          (error, results) => {
            if (error) throw error;
            console.log(`Department ${departmentName} has been added to the database`);
            main();
          }
        );
      });
  }
  


// Function to add a new role to the database
function addRole() {
    // Prompt the user for the new role details
    inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?"
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
        message: "Which department does the new role belong to?",
        choices: departmentChoices
      }
    ]).then((answer) => {
      const title = answer.title;
      const salary = answer.salary;
      const departmentName = answer.department;
  
      // Get the department ID for the selected department name
      const query = "SELECT id FROM department WHERE department_name = ?";
      connection.query(query, [departmentName], (err, res) => {
        if (err) throw err;
        const departmentID = res[0].id;
  
        // Insert the new role into the roles table
        const insertQuery = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(insertQuery, [title, salary, departmentID], (err, res) => {
          if (err) throw err;
          console.log(`Role ${title} has been added to the database.`);
          // call the main menu prompt again
          main();
        });
      });
    });
  }
  
  const employeeChoices = [];

connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;

    // Create a map of employee ids to names for later use
    const employeeMap = res.reduce((acc, employee) => {
        acc[employee.id] = `${employee.first_name} ${employee.last_name}`;
        return acc;
    }, {});

    // Add the employee names to the choices array
    employeeChoices.push(...Object.values(employeeMap));
});

const roleChoices = [];
connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;

    // Create a map of role ids to titles for later use
    const roleMap = res.reduce((acc, role) => {
        acc[role.id] = role.title;
        return acc;
    }, {});

    // Add the role titles to the choices array
    roleChoices.push(...Object.values(roleMap));
});

const roleMap = {};

connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;

    // Create a map of role titles to ids for later use
    res.forEach(role => {
        roleMap[role.title] = role.id;
    });
});

// Define and initialize the employeeMap object
const employeeMap = {};

// Add employee data to the employeeMap object
connection.query("SELECT id, first_name, last_name FROM employee", (err, results) => {
  if (err) throw err;
  results.forEach((employee) => {
    employeeMap[`${employee.first_name} ${employee.last_name}`] = employee.id;
  });
});


// Function to add a new employee to the database
function addEmployee() {
    // Prompt the user for the new employee details
    inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee?"
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the new employee?",
        when: (answers) => answers.firstName !== undefined
      },
      {
        type: "list",
        name: "role",
        message: "What is the role of the new employee?",
        choices: roleChoices
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the manager of the new employee?",
        choices: employeeChoices
      }
    ]).then((answer) => {
      const firstName = answer.firstName;
      const lastName = answer.lastName;
      const role_id = roleMap[answer.role];
      const manager_id = employeeMap[answer.manager];
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [firstName, lastName, role_id, manager_id],
        (err, res) => {
          if (err) throw err;
          console.log(`Employee ${firstName} ${lastName} has been added to the database.`);
          // Call the main menu prompt again
          main();
        }
      );
    });
  }
  


// Function to update an employee's role
function updateEmployeeRole() {
    // Get a list of all employees from the database
    const sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
  
      // Prompt the user to select an employee to update
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: results.map((employee) => ({ name: employee.name, value: employee.id })),
          },
          {
            name: "role",
            type: "input",
            message: "Enter the ID of the new role for the employee",
            validate: (input) => {
              if (Number.isInteger(Number(input))) {
                return true;
              } else {
                return "Please enter a valid number";
              }
            },
          },
        ])
        .then((answers) => {
          // Update the employee's role in the database
          const { employee, role } = answers;
          const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
          const values = [role, employee];
          connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log(`Successfully updated employee ${employee} with role ${role}`);
            // Return to the main menu
            main();
          });
        });
    });
  }
  

// Function to delete a department from the database
function deleteDepartment() {
    // Query the database for all departments
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error('Error retrieving departments:', err);
            return;
        }

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
                // Delete the department and any related roles or employees from the database
                connection.query(
                    'DELETE FROM department WHERE department_name = ?',
                    [answers.department],
                    (err, res) => {
                        if (err) {
                            console.error('Error deleting department:', err);
                            return;
                        }

                        console.log(`Department '${answers.department}' deleted successfully.`);

                        // Prompt the user to confirm if they want to delete another department or return to the main menu
                        inquirer.prompt([
                            {
                                name: 'continue',
                                type: 'confirm',
                                message: 'Do you want to delete another department?',
                                default: false
                            }
                        ]).then(answers => {
                            if (answers.continue) {
                                deleteDepartment();
                            } else {
                                main();
                            }
                        });
                    }
                );
            } else {
                console.log('Department not deleted.');
                main();
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
    // Query the database to get a list of all employee names
    connection.query('SELECT , first_name, last_name FROM employee', (err, results) => {
      if (err) throw err;
  
      // Create an array of objects with name and value properties for inquirer prompt choices
      const employeeNames = results.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }));
  
      // Prompt the user for the employee to delete
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeToDelete',
          message: 'Which employee would you like to delete?',
          choices: employeeNames
        }
      ]).then(answer => {
        // Delete the employee from the database
        connection.query(
          'DELETE FROM employee WHERE id = ?',
          [answer.employeeToDelete],
          (err, result) => {
            if (err) throw err;
            console.log(`Employee '${answer.employeeToDelete}' has been deleted from the database.`);
            // Call the main menu prompt
            main();
          }
        );
      });
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