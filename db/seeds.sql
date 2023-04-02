-- Insert into departments
INSERT INTO department (id,department_name)
VALUES (1,'Sales'),
       (2,'Marketing'),
       (3,'Engineering'),
       (4, 'Human Resources');
    
    SELECT * FROM department;



--  Insert roles
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'Sales Manager', 90000.00, 1),
       (2, 'Sales Respestive', 45000.00, 1),
       (3, 'Marketing Manager', 85000.00, 2),
       (4, 'Marketing Coordinator', 50000.00, 2),
       (5, 'Software Engineer', 100000.00, 3),
       (6, 'Database Administrator', 90000, 3),
       (7, 'Human Resources Manager', 80000, 4),
       (8, 'Recruiter', 60000, 4);
    
    SELECT * FROM roles;


-- Insert Employess
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Bob','Biscuit', 1, NULL ),
       (2, 'Chelsea', 'Cheddar', 2, 1 ),
       (3, 'Roger', 'Risotto', 3, NULL),
       (4, 'Alice', 'Apple', 4, 3),
       (5, 'Kameron', 'Hawk', 5, NULL),
       (6, 'Tabitha', 'Tomatoe', 6, 5),
       (7, 'Cassandra', 'Cabbage', 7, NULL),
       (8, 'Samantha', 'Salad', 8, 7);
    
    SELECT * FROM employee;
