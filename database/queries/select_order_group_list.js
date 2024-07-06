const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");
const { promisify } = require("util");

const db = new sqlite3.Database(dbPath);

// Преобразуем db.run в промис
const all = promisify(db.all).bind(db);

// Функция для выбора списка групп заказов
const selectOrderGroupList = async () => {
  const sql = `
    SELECT cc.contractor_id AS contractorId,
           cc.contractor AS contractor,
           cc.contractor_name AS contractorName,
           SUM(COALESCE(o.order_amount, 0)) AS orderAmount,
           FALSE AS isSelect
    FROM contractors AS cc
    LEFT JOIN contracts AS cct ON cct.contractor_id = cc.contractor_id
    LEFT JOIN orders AS o ON o.contract_id = cct.contract_id
    LEFT JOIN invoices AS i ON i.invoice_id = o.invoice_id
    WHERE cct.is_active = 1 AND (i.is_payid = 0 OR i.is_payid IS NULL)
    GROUP BY cc.contractor_id, cc.contractor, cc.contractor_name;
  `;

  try {
    const data = await all(sql);
    return data;
  } catch (error) {
    throw new Error(`Error selecting order group list: ${error.message}`);
  }
};

// Экспортируем функцию
module.exports = { selectOrderGroupList };
