const express = require("express");
const {
  generateSessionKey,
  checkUserPasshash,
  checkSession,
  insertUser,
} = require("../controllers/auth");

const router = express.Router({ mergeParams: true });

router.post("/register", async (req, res) => {
  try {
    const userLogin = req.body.login;
    const userPassword = req.body.password;

    if (!userLogin || !userPassword) {
      throw new Error("Не заполнен логин или пароль");
    }
    const userId = await insertUser(userLogin, userPassword);
    const sessionKey = generateSessionKey(userId);
    const userRole = 1;
    res.status(200).json({ userLogin, userRole, userSessionKey: sessionKey });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { login: userLogin, password: userPassword } = req.body;

    if (!userLogin || !userPassword) {
      throw new Error("Не заполнен логин или пароль");
    }

    const [userId, userRole] = await checkUserPasshash(userLogin, userPassword);

    if (!userId) {
      throw new Error("Invalid user_login or password");
    }

    const sessionKey = generateSessionKey(userId);
    res.status(200).json({ userLogin, userRole, userSessionKey: sessionKey });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get("/check_user_session", async (req, res) => {
  try {
    const sessionKey = req.headers["authorization"];
    const [, , error] = await checkSession(sessionKey);

    if (error) {
      throw new Error(error);
    }

    res.status(200).json({ user_session: true });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
