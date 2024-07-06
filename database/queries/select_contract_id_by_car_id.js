const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");

// Функция для получения contract_id по car_id
const getContractId = (carId) => {
  return new Promise((resolve, reject) => {
    const conn = new sqlite3.Database(dbPath);
    conn.get(
      "SELECT contract_id FROM cars cr LEFT JOIN contracts cn ON cn.contractor_id = cr.owner_id WHERE car_id = ?",
      [carId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.contract_id);
      }
    );
    conn.close();
  });
};

// Экспортируем функцию
module.exports = { getContractId };
