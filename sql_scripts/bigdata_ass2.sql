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
PRIMARY KEY (`Staff_ID`),
FOREIGN KEY (`Branch_ID`) REFERENCES `Branch` (`Branch_ID`)
);
CREATE TABLE `Remuneration` (
`Role` varchar(20),
`Salary` float,
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

