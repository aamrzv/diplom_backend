const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");
const { getContractId } = require("./select_contract_id_by_car_id");

// Функция для вставки заказа
const insertOrder = async (jsonData, userId) => {
  const conn = new sqlite3.Database(dbPath);

  try {
    const contractId = await getContractId(jsonData.carId);
    const nextActNumber = (await selectMaxActNumber(contractId)) + 1;
    const orderDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const orderAmount = jsonData.detail.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const carId = jsonData.carId;
    const contractorId = await getContractorId(contractId);
    // Начинаем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("BEGIN TRANSACTION", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Вставляем основную информацию заказа
    const orderInsert = await new Promise((resolve, reject) => {
      conn.run(
        "INSERT INTO orders (order_date, user_id, contract_id, order_amount, car_id, act_number) VALUES (?, ?, ?, ?, ?, ?)",
        [orderDate, userId, contractId, orderAmount, carId, nextActNumber],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID); // Возвращаем ID только что созданного заказа
        }
      );
    });

    // Вставляем детали заказа
    const detailsInsertPromises = jsonData.detail.map((item) => {
      return new Promise((resolve, reject) => {
        conn.run(
          "INSERT INTO orders_detail (order_id, selector_id, price_id, quantity, amount) VALUES (?, ?, ?, ?, ?)",
          [orderInsert, item.selectorId, item.priceId, item.value, item.amount],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    await Promise.all(detailsInsertPromises);

    // Завершаем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("COMMIT", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return { orderInsert, contractorId };
  } catch (error) {
    // В случае ошибки откатываем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("ROLLBACK", (err) => {
        if (err) console.error("Rollback error:", err.message);
        resolve();
      });
    });
    throw error;
  } finally {
    conn.close();
  }
};

// Функция для выбора максимального act_number по contract_id
const selectMaxActNumber = (contractId) => {
  return new Promise((resolve, reject) => {
    const conn = new sqlite3.Database(dbPath);
    conn.get(
      `
      SELECT MAX(COALESCE(act_number, 0)) AS max_act_number 
      FROM orders o 
      LEFT JOIN contracts cct ON cct.contract_id = o.contract_id 
      WHERE cct.contract_id = ?
      `,
      [contractId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.max_act_number || 0);
      }
    );
    conn.close();
  });
};
// Функция для выбора contractor_id по contract_id
const getContractorId = (contractId) => {
  return new Promise((resolve, reject) => {
    const conn = new sqlite3.Database(dbPath);
    conn.get(
      `
      SELECT contractor_id
      FROM  contracts 
      WHERE contract_id = ?
      `,
      [contractId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.contractor_id || 0);
      }
    );
    conn.close();
  });
};

module.exports = { insertOrder };
