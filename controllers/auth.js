const crypto = require("crypto");
const sqlite3 = require("sqlite3");
const { dbPath } = require("../constants");

// Функция для хэширования паролей
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Функция для проверки хэша пароля пользователя
const checkUserPasshash = async (userLogin, userPassword) => {
  const user = await selectUserPasshash(userLogin);
  if (user[1] !== hashPassword(userPassword)) {
    return [null, null];
  }
  return [user[0], user[2]];
};

// Функция для создания нового пользователя
const createUser = async (userLogin, userPassword) => {
  const [success, error] = await insertUser(
    userLogin,
    hashPassword(userPassword)
  );
  return [success, error];
};

// Функция для генерации ключа сессии
const generateSessionKey = (userId) => {
  const sessionKey = crypto.randomBytes(16).toString("hex");
  insertSessionKey(userId, sessionKey);
  return sessionKey;
};

// Функция для проверки сессии
const checkSession = async (sessionKey) => {
  const [userId, userRoleId, error] = await selectUserIdBySessionKey(
    sessionKey
  );
  return [userId, userRoleId, error];
};

// Функция для выборки хэша пароля пользователя
const selectUserPasshash = (userLogin) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.get(
      "SELECT u.user_id, u.user_password_hash, ur.user_role_name FROM users u LEFT JOIN users_roles ur ON ur.user_role_id = u.user_role_id WHERE u.user_login = ?",
      [userLogin],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row) {
          return resolve([null, null, null]);
        }
        resolve([row.user_id, row.user_password_hash, row.user_role_name]);
      }
    );
    db.close();
  });
};

// Функция для вставки ключа сессии
const insertSessionKey = (userId, sessionKey) => {
  const db = new sqlite3.Database(dbPath);
  const expirationTime = new Date(Date.now() + 86400000).toISOString(); // 1 day
  db.run(
    "INSERT INTO sessions (user_id, session_key, expiration_time) VALUES (?, ?, ?)",
    [userId, sessionKey, expirationTime],
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
  db.close();
};

// Функция для создания нового пользователя
const insertUser = (userLogin, userPassword) => {
  const userPasswordHash = hashPassword(userPassword);
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.run(
      "INSERT INTO users (user_login, user_password_hash, user_role_id, is_active) VALUES (?, ?, 1, 1)",
      [userLogin, userPasswordHash],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return resolve([false, "Такой логин уже занят"]);
          } else {
            return resolve([
              false,
              "Ошибка при создании пользователя: " + err.message,
            ]);
          }
        }
        resolve(this.lastID);
      }
    );
    db.close();
  });
};

// Функция для выборки user_id и user_role_id по ключу сессии
const selectUserIdBySessionKey = (sessionKey) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.get(
      "SELECT s.user_id, u.user_role_id FROM sessions s LEFT JOIN users u ON u.user_id = s.user_id WHERE session_key = ?",
      [sessionKey],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row) {
          return resolve([null, null, "Неверный ключ сессии или сеанс истек"]);
        }
        resolve([row.user_id, row.user_role_id, null]);
      }
    );
    db.close();
  });
};

module.exports = {
  hashPassword,
  checkUserPasshash,
  createUser,
  generateSessionKey,
  checkSession,
  insertUser,
  selectUserIdBySessionKey,
};
