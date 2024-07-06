const { checkSession } = require("../controllers/auth");

const authorize = (allowedRoles) => async (req, res, next) => {
  const sessionKey = req.headers["authorization"];
  const [userId, userRoleId, error] = await checkSession(sessionKey);

  if (error) {
    return res.status(401).json({ error: error });
  } else if (!allowedRoles.includes(userRoleId)) {
    return res
      .status(403)
      .json({ error: "Роль пользователя не позволяет данную операцию" });
  }

  req.userId = userId; // Сохраняем userId в req, чтобы использовать его в последующих middleware или маршрутах
  req.userRoleId = userRoleId;

  next();
};

module.exports = { authorize };
