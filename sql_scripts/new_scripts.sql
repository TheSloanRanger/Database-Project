CREATE DATABASE supermarket;
USE supermarket;
CREATE TABLE `Customer` (
`CustomerID` int NOT NULL,
`Name` varchar(30),
`Email` varchar(45),
`Address` varchar(255),
`PhoneNo` varchar(15),
PRIMARY KEY (`CustomerID`)
);
CREATE TABLE `Supplier` (
`Sup_ID` int NOT NULL,
`Name` varchar(30),
`Address` varchar(255),
`Email` varchar(45),
`Phone_No` varchar(15),
PRIMARY KEY (`Sup_ID`)
);
CREATE TABLE `Stock` (
`Stock_ID` int NOT NULL,
`Name` varchar(30),
`CostPrice` float,
`Sup_ID` int,
`Count` int,
PRIMARY KEY (`Stock_ID`),
FOREIGN KEY (`Sup_ID`) REFERENCES `Supplier` (`Sup_ID`)
);
CREATE TABLE `Branch` (
`Branch_ID` int NOT NULL,
`Address` varchar(255),
`Email` varchar(45),
`Phone_No` varchar(15),
PRIMARY KEY (`Branch_ID`)
);
CREATE TABLE `Shift` (
`Shift_ID` int NOT NULL,
`Start_Time` Datetime,
`End_Time` Datetime,
PRIMARY KEY (`Shift_ID`)
);
CREATE TABLE `Staff` (
`Staff_ID` int NOT NULL,
`Name` varchar(30),
`Address` varchar(255),
`Email` varchar(45),
`Phone_No` varchar(15),
`Branch_ID` int,
`Shift_ID` int,
`Delete_Flag` BOOLEAN,
PRIMARY KEY (`Staff_ID`),
FOREIGN KEY (`Branch_ID`) REFERENCES `Branch` (`Branch_ID`)
);
CREATE TABLE `Remuneration` (
`Role` varchar(20),
`Salary` fticular, acceloat,Vehicle_ID
`Staff_ID` int,
PRIMARY KEY (`Role`),
FOREIGN KEY (`Staff_ID`) REFERENCES `Staff` (`Staff_ID`)
);
CREATE TABLE `Online_Order` (
`Order_ID` int NOT NULL,
`Staff_ID` int,
`Cust_ID` int,
PRIMARY KEY (`Order_ID`),
FOREIGN KEY (`Staff_ID`) REFERENCES `Staff` (`Staff_ID`),
FOREIGN KEY (`Cust_ID`) REFERENCES `Customer` (`CustomerID`)
);
CREATE TABLE `Transaction` (
`Transac_ID` int NOT NULL,
`Branch_ID` int,
`Cust_ID` int,
PRIMARY KEY (`Transac_ID`),
FOREIGN KEY (`Branch_ID`) REFERENCES `Branch` (`Branch_ID`),
FOREIGN KEY (`Cust_ID`) REFERENCES `Customer` (`CustomerID`)
);
CREATE TABLE `Item` (
`Item_ID` int NOT NULL,
`Sup_ID` int,
`Stock_ID` int,
`ExpiryDate` Datetime,
`Order_ID` int,
PRIMARY KEY (`Item_ID`),
FOREIGN KEY (`Sup_ID`) REFERENCES `Supplier` (`Sup_ID`),
FOREIGN KEY (`Stock_ID`) REFERENCES `Stock` (`Stock_ID`),
FOREIGN KEY (`Order_ID`) REFERENCES `Online_Order` (`Order_ID`)
);
CREATE TABLE `Delivery_Vehicle` (
`Vehicle_ID` int NOT NULL,
`Staff_ID` int,
`Shift_ID` int,
`Branch_ID` int,
PRIMARY KEY (`Vehicle_ID`),
FOREIGN KEY (`Staff_ID`) REFERENCES `Staff` (`Staff_ID`),
FOREIGN KEY (`Shift_ID`) REFERENCES `Shift` (`Shift_ID`),
FOREIGN KEY (`Branch_ID`) REFERENCES `Branch` (`Branch_ID`)
);
CREATE TABLE `User` (
`UserID` int NOT NULL,
`password` varchar(20),
`UserType` varchar(10),
PRIMARY KEY (`UserID`)
);
SELECT * FROM Staff;

SELECT * FROM Stock;

UPDATE Stock
SET CostPrice=10
WHERE Stock_ID=112;

SELECT * FROM Transaction;

DELETE FROM Transaction
WHERE Cust_ID=5;

SELECT Customer.CustomerID,Customer.Email,Online_Order.Order_ID
FROM Customer
INNER JOIN Online_Order
ON Customer.CustomerID=Online_Order.Cust_ID;

SELECT Branch.Branch_ID,Branch.Address,Transaction.Transac_ID,Transaction.Cust_ID
FROM Branch
LEFT JOIN Transaction
ON Branch.Branch_ID=Transaction.Branch_ID;

SELECT Supplier.Sup_ID,Supplier.Name,Supplier.Address,Stock.Name,Stock.CostPrice
FROM Stock
RIGHT JOIN Supplier
ON Supplier.Sup_ID=Stock.Sup_ID;

SELECT CustomerID,Name,Email,Address
FROM Customer c
WHERE EXISTS (SELECT *
FROM Online_Order o
WHERE c.CustomerID=o.Cust_ID
AND Staff_ID>2);

CREATE OR REPLACE VIEW Customer_View AS
SELECT CustomerID,Name,Email
FROM Customer
WHERE CustomerID>2;

SELECT * FROM Customer_View;

CREATE VIEW Staff_View AS
SELECT Staff.Staff_ID, Staff.Name, Staff.Email, Branch.Branch_ID
FROM Staff
INNER JOIN Branch
ON Staff.Branch_ID=Branch.Branch_ID;

SELECT* FROM Staff_View;

CREATE VIEW Supplier_View AS
SELECT Supplier.Sup_ID,Supplier.Name,Supplier.Email,Stock.Stock_ID,Stock.CostPrice,Stock.Count
FROM Supplier
INNER JOIN Stock
ON Supplier.Sup_ID=Stock.Sup_ID;

SELECT * FROM Supplier_View;

CREATE VIEW CFV AS
SELECT
    Customer.CustomerID,
    Customer.Name AS CustomerName,
    Customer.Email AS CustomerEmail,
    Customer.Address AS CustomerAddress,
    Customer.PhoneNo AS CustomerPhoneNo,
    Online_Order.Order_ID,
    Online_Order.Staff_ID,
    Online_Order.Cust_ID,
    Item.Item_ID,
    Item.Stock_ID AS ItemStockID,
    Item.ExpiryDate,
    Stock.Name AS StockName,
    Stock.CostPrice,
    Stock.Sup_ID AS StockSupplierID,
    Stock.Count AS StockCount
FROM
    Customer
LEFT JOIN
    Online_Order ON Customer.CustomerID = Online_Order.Cust_ID
LEFT JOIN
    Item ON Online_Order.Order_ID = Item.Order_ID
LEFT JOIN
    Stock ON Item.Stock_ID = Stock.Stock_ID;

INSERT INTO `Item` (`Item_ID`, `Sup_ID`, `Stock_ID`, `ExpiryDate`, `Order_ID`)
VALUES
(111, 1, 112, '2023-07-31 23:59:59', 5),   -- Item for existing Order with ID 5
(112, 2, 1245, '2023-06-30 23:59:59', 4),   -- Item for existing Order with ID 4
(113, 3, 3, '2023-05-31 23:59:59', 3),   -- Item for existing Order with ID 3
(114, 4, 4, '2023-04-30 23:59:59', 2),   -- Item for existing Order with ID 2
(115, 5, 5, '2023-03-31 23:59:59', 1);   -- Item for existing Order with ID 1

CREATE TABLE `Account` (
`UserID` int NOT NULL,
`email` varchar(45),
`password` varchar(255),
`UserType` varchar(10),
PRIMARY KEY (`UserID`)
);

-- STAFF TABLE
-- STAFF TABLE-- STAFF TABLE
INSERT INTO `Account` (`UserID`, `email`, `password`, `UserType`)
VALUES
(100, 'alicejohnson@gmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Manager'),
(101, 'david.smith@hotmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff'),
(102, 'emily.brown@outlook.co.uk', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff'),
(103, 'michael.davis@yahoo.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff'),
(104, 'olivia.taylor@gmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff'),
(105, 'sophia.johnson@gmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff'),
(106, 'benjamin.miller@hotmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff'),
(107, 'ethan.garcia@gmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Staff');

-- CUSTOMER TABLE
INSERT INTO `Account` (`UserID`, `email`, `password`, `UserType`)
VALUES
(1, 'alistair.smythe@gmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Customer'),
(2, 'levi.patterson@yahoo.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Customer'),
(3, 'isabella.morgan@outlook.co.uk', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Customer'),
(4, 'samuel.harrison@gmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Customer'),
(5, 'stella.turner@hotmail.com', '$2b$10$EPsadioveMEFwLGTyICnkeUbGalsFtCwYf6.j.atKb9XcfAIDG06G', 'Customer');

 -- New stock table
 -- CREATE TABLE
CREATE TABLE Stock (
    Stock_ID INT PRIMARY KEY,
    Name VARCHAR(255),
    CostPrice FLOAT,
    Sup_ID INT,
    Count INT,
    Description TEXT,
    ImageLink VARCHAR(255)
);

-- INSERT INTO STATEMENTS
INSERT INTO Stock (Stock_ID, Name, CostsPrice, Sup_ID, Count, Description, ImageLink)
VALUES
(112, 'Gourmet Cinnamon Spice Blend', 10, 3, 1, 'A delightful blend of premium cinnamon spices, perfect for enhancing the flavor of your favorite dishes.', 'https://example.com/cinnamon-spice-image.jpg'),
(234, 'Smart LED TV - 55 inch', 399, 5, 1, 'Immerse yourself in stunning visuals with our 55-inch Smart LED TV, featuring advanced technology and a sleek design.', 'https://example.com/smart-led-tv-image.jpg'),
(987, 'Organic Avocado (Pack of 3)', 1.2, 4, 3, 'Enjoy the creamy goodness of organic avocados. This pack of 3 is perfect for a healthy and delicious treat.', 'https://example.com/organic-avocado-image.jpg'),
(1245, 'Organic Whole Wheat Bread', 2.5, 1, 1, 'Nutritious and delicious organic whole wheat bread, made with the finest ingredients for a wholesome taste.', 'https://example.com/whole-wheat-bread-image.jpg'),
(6789, 'Tropical Quench Fruit Juice', 1.2, 2, 1, 'Savor the refreshing taste of tropical fruits in every sip. Our fruit juice is a burst of natural flavors.', 'https://example.com/tropical-fruit-juice-image.jpg');


CREATE VIEW LoginView AS
SELECT
    Account.UserID AS AccountID,
    Account.email,
    Account.UserType,
    CASE
        WHEN Account.UserType = 'Customer' THEN Customer.Name
        WHEN Account.UserType = 'Manager' THEN Staff.Name
        WHEN Account.UserType = 'Staff' THEN Staff.Name
    END AS Name,
    CASE
        WHEN Account.UserType = 'Customer' THEN Customer.Address
        WHEN Account.UserType = 'Manager' THEN Staff.Address
        WHEN Account.UserType = 'Staff' THEN Staff.Address
    END AS Address,
    CASE
        WHEN Account.UserType = 'Customer' THEN Customer.PhoneNo
        WHEN Account.UserType = 'Manager' THEN Staff.Phone_No
        WHEN Account.UserType = 'Staff' THEN Staff.Phone_No
    END AS PhoneNo
FROM
    Account
LEFT JOIN
    Customer ON Account.email = Customer.Email AND Account.UserType = 'Customer'
LEFT JOIN
    Staff ON Account.email = Staff.Email AND (Account.UserType = 'Staff' OR Account.UserType = 'Manager');


CREATE VIEW Customer_Order_View AS
SELECT
    Customer.CustomerID,
    Customer.Name AS CustomerName,
    Online_Order.Order_ID,
    Stock.Name AS StockName,
    Stock.CostPrice,
    Staff.Name AS StaffName,
    Item.Item_ID,
    Item.Stock_ID AS ItemStockID,
    Item.ExpiryDate
FROM
    Customer
JOIN Online_Order ON Customer.CustomerID = Online_Order.Cust_ID
JOIN Item ON Online_Order.Order_ID = Item.Order_ID
JOIN Stock ON Item.Stock_ID = Stock.Stock_ID
JOIN Staff ON Online_Order.Staff_ID = Staff.Staff_ID;


CREATE VIEW Customer_Information_View AS
SELECT
    Customer.CustomerID,
    Customer.Name,
    Customer.Email,
    Customer.Address,
    Customer.PhoneNo
FROM
    Customer


CREATE VIEW LoginView AS
SELECT
    Account.UserID AS AccountID,
    Account.email AS Email,
    Account.UserType,
    CASE
        WHEN Account.UserType = 'Customer' THEN Customer.Name
        WHEN Account.UserType = 'Manager' THEN Staff.Name
        WHEN Account.UserType = 'Staff' THEN Staff.Name
    END AS Name,
    CASE
        WHEN Account.UserType = 'Customer' THEN Customer.Address
        WHEN Account.UserType = 'Manager' THEN Staff.Address
        WHEN Account.UserType = 'Staff' THEN Staff.Address
    END AS Address,
    CASE
        WHEN Account.UserType = 'Customer' THEN Customer.PhoneNo
        WHEN Account.UserType = 'Manager' THEN Staff.Phone_No
        WHEN Account.UserType = 'Staff' THEN Staff.Phone_No
    END AS PhoneNo
FROM
    Account
LEFT JOIN
    Customer ON Account.email = Customer.Email AND Account.UserType = 'Customer'
LEFT JOIN
    Staff ON Account.email = Staff.Email AND (Account.UserType = 'Staff' OR Account.UserType = 'Manager');

 -- Best performing Items:
SELECT
    Stock.Stock_ID,
    Stock.Name AS StockName,
    Stock.CostPrice,
    Stock.Sup_ID AS StockSupplierID,
    COUNT(Item.Stock_ID) AS NumberOfItems
FROM
    Stock
LEFT JOIN Item ON Stock.Stock_ID = Item.Stock_ID
GROUP BY
    Stock.Stock_ID, Stock.Name, Stock.CostPrice, Stock.Sup_ID
ORDER BY
    NumberOfItems DESC;

 -- Total sales:

 SELECT
    SUM(Stock.CostPrice) AS TotalSales
FROM
    Stock
JOIN Item ON Stock.Stock_ID = Item.Stock_ID;




-- Ben Inserting mock data for STAFF
INSERT INTO Staff (Staff_ID, Name, Address, Email, Phone_No, Branch_ID, Shift_ID, Delete_Flag)
VALUES
    (100, 'Manager Alice Innit t', '15 Baker Street, Marylebone, London, W1U 8EB, UK', 'alicejohnson@gmail.com', '(44) 20 1234 56', 1001, 3, false),
    (101, 'Test David Smith', '40 Regent Street, Westminster, London, SW1Y 4PP, UK', 'david.smith@hotmail.com', '(44) 20 1234 56', 1001, 2, false),
    (102, 'Emily Brown', '41 Market Close, Manchester, UK', 'emily.brown@outlook.co.uk', '(44) 20 1234 56', 1002, 1, false),
    (103, 'Michael Davis', '12 Cambridge Street, Glasgow, G3 6RU', 'michael.davis@yahoo.com', '(44) 141 234 56', 1003, 3, false),
    (104, 'Olivia Taylor', '5 New Street, Birmingham, UK', 'olivia.taylor@gmail.com', '(44) 141 234 56', 1004, 1, false),
    (105, 'Sophia Johnson', '31 Market Street, Manchester, UK', 'sophia.johnson@gmail.com', '(44) 20 1234 56', 1002, 2, false),
    (106, 'Benjamin Miller', '20 Lime Street, Liverpool, L1 1JQ, UK', 'benjamin.miller@hotmail.com', '(44) 141 234 56', 1005, 1, false),
    (107, 'Ethan Garcia', '22 Bullring Street, Birmingham, UK', 'ethan.garcia@gmail.com', '(44) 20 1234 56', 1004, 2, false);
