const sqlite3 = require("sqlite3");
const { promisify } = require("util");
const { dbPath } = require("../../constants");

const db = new sqlite3.Database(dbPath);

// Преобразуем db.run в промис
const get = promisify(db.get).bind(db);

// Функция для выбора максимального номера акта по идентификатору контрактора
const selectMaxActNumber = async (contractId) => {
  const sql = `
    SELECT MAX(COALESCE(o.act_number, 0)) AS maxActNumber
    FROM orders AS o
    LEFT JOIN contracts AS cct ON cct.contract_id = o.contract_id
    LEFT JOIN contractors AS cc ON cct.contractor_id = cc.contractor_id
    WHERE cc.contractor = ?;
  `;

  try {
    const { maxActNumber } = await get(sql, [contractId]);
    return maxActNumber;
  } catch (error) {
    throw new Error(`Error selecting max act number: ${error.message}`);
  }
};

// Экспортируем функцию
module.exports = { selectMaxActNumber };
