const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");

const db = new sqlite3.Database(dbPath);

// Функция для выбора списка заказов по идентификатору контрактора
const selectOrder = async (orderId) => {
  const conn = new sqlite3.Database(dbPath);
  const sqlHeader = `
    WITH order_wheel_size_car_group AS(
            SELECT DISTINCT  od.order_id
                            ,p.wheel_size_id 		
                            ,p.car_group_id 			
            FROM orders_detail AS od 
            LEFT JOIN prices   AS p ON p.price_id = od.price_id 
            WHERE p.wheel_size_id IS NOT NULL AND p.car_group_id IS NOT NULL
                  AND od.order_id =  ?
    )
    SELECT   o.order_id           AS orderId
            ,o.order_date         AS orderDate     
            ,o.act_number         AS actNumber   
            ,i.invoice_number     AS invoiceNumber 
            ,cr.contractor_name   AS contractor
            ,cr.contractor_id 		AS contractorId
            ,o.car_id  						AS carId
            ,p.wheel_size_id 			AS wheelSizeId
            ,p.car_group_id 			AS carGroupId   
            ,o.order_amount       AS orderAmount
    FROM orders AS o
    LEFT JOIN order_wheel_size_car_group AS p ON p.order_id = o.order_id 
    LEFT JOIN invoices      AS i    ON i.invoice_id = o.invoice_id
    LEFT JOIN cars          AS crs  ON crs.car_id = o.car_id  
    LEFT JOIN contractors   AS cr   ON cr.contractor_id = crs.owner_id
    WHERE o.order_id =  ?
  `;
  const sqlDetail = `
    SELECT od.selector_id AS selectorId
 	  	    ,p.service_id   AS serviceId
 	  	    ,od.quantity    AS value
 	  	    ,od.amount      AS amount
 	  	    ,od.price_id    AS priceId
          ,p.price        AS price
    FROM orders_detail AS od 
    LEFT JOIN prices   AS p ON p.price_id = od.price_id 
    WHERE od.order_id = ?
`;
  try {
    const orderHeader = await new Promise((resolve, reject) => {
      conn.all(sqlHeader, [orderId, orderId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    const orderDetail = await new Promise((resolve, reject) => {
      conn.all(sqlDetail, [orderId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    const data = {
      ...orderHeader[0],
      detail: orderDetail[0] ? orderDetail : undefined,
    };
    return data;
  } catch (error) {
    throw new Error(`Error selecting order list: ${error.message}`);
  }
};

// Экспортируем функцию
module.exports = { selectOrder };
