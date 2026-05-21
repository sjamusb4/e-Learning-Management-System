const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = req.headers.token || (authHeader && authHeader.split(" ")[1]); // Support both "Authorization: Bearer <token>" and "token: <token>"

  if (!token) {
    return res.status(401).send({
      msg: "Unauthorized: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return res.status(401).send({
      msg: "Unauthorized: Invalid token",
    });
  }
}

module.exports = {
  authMiddleware,
};
