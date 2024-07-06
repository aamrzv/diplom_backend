const sqlite3 = require("sqlite3");
const { dbPath } = require("../../constants");

// Функция для удаления заказа
const deleteOrder = async (orderId) => {
  const conn = new sqlite3.Database(dbPath);

  try {
    // Начинаем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("BEGIN TRANSACTION", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Удаляем заказ
    await new Promise((resolve, reject) => {
      conn.run(
        "DELETE FROM orders WHERE order_id = ?",
        [orderId],
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

    // Завершаем транзакцию
    await new Promise((resolve, reject) => {
      conn.run("COMMIT", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return { success: true };
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

module.exports = { deleteOrder };
