--Task # 1
INSERT INTO account
(account_firstname, account_lastname, account_email, account_password )
VALUES
('Tony', 'Stark', 'tony@stark.com', 'Iam1ronM@n');

--Task #2
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

--Task #3
DELETE FROM account
WHERE account_firstname = 'Tony';

--Task #4
UPDATE inventory
set inv_description = REPLACE (inv_description, 'small interior', 'a huge interior');

--Task #5
SELECT 
	inventory.inv_model,
	inventory.inv_make,
	classification.classification_name
FROM inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE classification.classification_id = 2;

--Task #6 
UPDATE inventory
SET inv_images = REPLACE(
	inv_images, 
	'/images/', 
	'/images/vehicles/');
	
UPDATE inventory
SET inv_thumbnail = REPLACE(
	inv_thumbnail, 
	'/images/', 
	'/images/vehicles/');
	