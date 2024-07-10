function getCurrentLocalDateTime() {
  const now = new Date(); //объект автоматически получает текущую дату и время в локальном часовом поясе, используя системные настройки времени.
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Получаем текущий месяц, добавляя 1, так как месяцы в JavaScript начинаются с 0 (январь = 0)
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Экспортируем функцию
module.exports = { getCurrentLocalDateTime };
