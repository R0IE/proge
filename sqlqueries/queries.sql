
-- 1. To get started first find out how many orders are linked with the only shop in Tallinn.
ID for this shop is 74. (SELECT, COUNT, WHERE)

SELECT COUNT(*)
FROM orders
WHERE shop_id = 74;

-- 2. Then how many of those orders were made in the last
year 2022-2023? (SELECT, COUNT, WHERE)

SELECT COUNT(*)
FROM orders
WHERE shop_id = 74
  AND order_date BETWEEN '2022-01-01' AND '2023-12-31';

-- 3. Find out how many shops are in Viljandi.

SELECT COUNT(*)
FROM shops s
JOIN addresses a ON s.address_id = a.address_id
WHERE a.city = 'Viljandi';