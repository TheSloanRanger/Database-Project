-- Customer table
INSERT INTO `supermarket`.`Customer` (`CustomerID`, `Name`, `Email`, `Address`, `PhoneNo`)
VALUES
(1, 'Alice Johnson', 'alice.j@example.com', '123 Oak St', '555-1111'),
(2, 'Bob Smith', 'bob.smith@example.com', '456 Pine Ave', '555-2222'),
(3, 'Charlie Brown', 'charlie.b@example.com', '789 Elm Ln', '555-3333'),
(4, 'Diana Lee', 'diana.lee@example.com', '987 Maple Dr', '555-4444'),
(5, 'Ethan Davis', 'ethan.d@example.com', '654 Cedar Blvd', '555-5555');

-- Supplier table
INSERT INTO `supermarket`.`Supplier` (`Sup_ID`, `Name`, `Address`, `Email`, `Phone_No`)
VALUES
(1, 'ABC Electronics', '123 Tech St', 'abc.electronics@example.com', '555-1234'),
(2, 'XYZ Foods', '456 Food Ave', 'xyz.foods@example.com', '555-5678'),
(3, 'Global Textiles', '789 Fabric Ln', 'global.textiles@example.com', '555-9012'),
(4, 'Green Farms', '987 Farm Dr', 'green.farms@example.com', '555-3456'),
(5, 'Silver Motors', '654 Auto Blvd', 'silver.motors@example.com', '555-7890');

-- Stock table
INSERT INTO `supermarket`.`Stock` (`Stock_ID`, `Name`, `CostPrice`, `Sup_ID`, `Count`)
VALUES
(1, 'Laptop', 899.99, 1, 50),
(2, 'Apples', 1.99, 2, 200),
(3, 'Cotton Fabric', 5.99, 3, 1000),
(4, 'Organic Vegetables', 2.49, 4, 150),
(5, 'Electric Car', 29999.99, 5, 10);

-- Branch table
INSERT INTO `supermarket`.`Branch` (`Branch_ID`, `Address`, `Email`, `Phone_No`)
VALUES
(1, '321 Main St', 'branch1@example.com', '555-1111'),
(2, '654 Broad Ave', 'branch2@example.com', '555-2222'),
(3, '987 High Ln', 'branch3@example.com', '555-3333'),
(4, '234 Pine Dr', 'branch4@example.com', '555-4444'),
(5, '567 Elm Blvd', 'branch5@example.com', '555-5555');

-- Shift table
INSERT INTO `supermarket`.`Shift` (`Shift_ID`, `Start_Time`, `End_Time`)
VALUES
(1, '2023-01-01 08:00:00', '2023-01-01 16:00:00'),
(2, '2023-01-01 12:00:00', '2023-01-01 20:00:00'),
(3, '2023-01-01 16:00:00', '2023-01-01 00:00:00'),
(4, '2023-01-01 09:00:00', '2023-01-01 17:00:00'),
(5, '2023-01-01 14:00:00', '2023-01-01 22:00:00');

-- Staff table
INSERT INTO `supermarket`.`Staff` (`Staff_ID`, `Name`, `Address`, `Email`, `Phone_No`, `Branch_ID`, `Shift_ID`)
VALUES
(1, 'Emma White', '789 Birch St', 'emma.white@example.com', '555-1234', 1, 1),
(2, 'Frank Johnson', '654 Pine Ave', 'frank.j@example.com', '555-5678', 2, 2),
(3, 'Grace Miller', '987 Cedar Ln', 'grace.m@example.com', '555-9012', 3, 3),
(4, 'Henry Davis', '234 Oak Dr', 'henry.d@example.com', '555-3456', 4, 4),
(5, 'Ivy Brown', '567 Elm Blvd', 'ivy.b@example.com', '555-7890', 5, 5);

-- Remuneration table
INSERT INTO `supermarket`.`Remuneration` (`Role`, `Salary`, `Staff_ID`)
VALUES
('Manager', 50000.00, 1),
('Clerk', 30000.00, 2),
('Salesperson', 35000.00, 3),
('Technician', 45000.00, 4),
('Driver', 40000.00, 5);

-- Online_Order table
INSERT INTO `supermarket`.`Online_Order` (`Order_ID`, `Staff_ID`, `Cust_ID`)
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);

-- Transaction table
INSERT INTO `supermarket`.`Transaction` (`Transac_ID`, `Branch_ID`, `Cust_ID`)
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);

-- Item table
INSERT INTO `supermarket`.`Item` (`Item_ID`, `Sup_ID`, `Stock_ID`, `ExpiryDate`, `Order_ID`)
VALUES
(1, 1, 1, '2023-12-31 23:59:59', 1),
(2, 2, 2, '2023-11-30 23:59:59', 2),
(3, 3, 3, '2023-10-31 23:59:59', 3),
(4, 4, 4, '2023-09-30 23:59:59', 4),
(5, 5, 5, '2023-08-31 23:59:59', 5);

-- Delivery_Vehicle table
INSERT INTO `supermarket`.`Delivery_Vehicle` (`Vehicle_ID`, `Staff_ID`, `Shift_ID`, `Branch_ID`)
VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

-- User table
INSERT INTO `supermarket`.`User` (`UserID`, `password`, `UserType`)
VALUES
(1, 'password1', 'Admin'),
(2, 'password2', 'Employee'),
(3, 'password3', 'Manager'),
(4, 'password4', 'Clerk'),
(5, 'password5', 'Customer');