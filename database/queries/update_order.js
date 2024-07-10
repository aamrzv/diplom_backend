const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");
const {
  getCurrentLocalDateTime,
} = require("../../utils/get-current-date-time");

// Функция для вставки заказа
const updateOrder = async (jsonData, userId) => {
  const conn = new sqlite3.Database(dbPath);

  try {
    const orderAmount = jsonData.detail.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    const orderId = jsonData.orderId;
    const orderChangeDate = getCurrentLocalDateTime();
    // Начинаем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("BEGIN TRANSACTION", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Обновляем хедер заказа
    await new Promise((resolve, reject) => {
      conn.run(
        "UPDATE orders SET order_amount=?, editor_id=?, order_change_date=?  WHERE order_id=?",
        [orderAmount, userId, orderChangeDate, orderId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Удаляем детали заказа (если они есть)
    await new Promise((resolve, reject) => {
      conn.run(
        "DELETE FROM orders_detail WHERE order_id = ?",
        [orderId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Вставляем детали заказа новые детали
    const detailsInsertPromises = jsonData.detail.map((item) => {
      return new Promise((resolve, reject) => {
        conn.run(
          "INSERT INTO orders_detail (order_id, selector_id, price_id, quantity, amount) VALUES (?, ?, ?, ?, ?)",
          [orderId, item.selectorId, item.priceId, item.value, item.amount],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    // Завершаем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("COMMIT", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return { orderId, contractorId: jsonData.contractorId, success: true };
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

module.exports = { updateOrder };
