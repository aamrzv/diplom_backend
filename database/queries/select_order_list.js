const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");
const { promisify } = require("util");

const db = new sqlite3.Database(dbPath);

// Преобразуем db.run в промис
const all = promisify(db.all).bind(db);

// Функция для выбора списка заказов по идентификатору контрактора
const selectOrderList = async (contractorId, pageSize, offset) => {
  const sql = `
    SELECT o.order_id                           AS orderId,
           o.order_date                         AS orderDate,
           o.act_number                         AS actNumber,
           cr.contractor_name                   AS contractorName,
           crs.car_license_plate                AS carNamber,
           cm.car_make || ' ' || cml.car_model  AS car,
           o.order_amount                       AS orderAmount,
           i.invoice_number                     AS invoiceNumber,
           COALESCE(i.is_payid, FALSE)          AS isPayid
    FROM orders AS o
    LEFT JOIN invoices      AS i    ON i.invoice_id = o.invoice_id
    LEFT JOIN cars          AS crs  ON crs.car_id = o.car_id
    LEFT JOIN contractors   AS cr   ON cr.contractor_id = crs.owner_id
    LEFT JOIN car_makes     AS cm   ON cm.car_make_id = crs.car_make_id
    LEFT JOIN car_models    AS cml  ON cml.car_model_id = crs.car_model_id
    WHERE cr.contractor_id = ?
    ORDER BY o.order_date DESC
    LIMIT ? OFFSET ?;
  `;

  try {
    const data = await all(sql, [contractorId, pageSize, offset]);
    return data;
  } catch (error) {
    throw new Error(`Error selecting order list: ${error.message}`);
  }
};

// Экспортируем функцию
module.exports = { selectOrderList };
