require("dotenv").config();

const jwt = require("jsonwebtoken");

const checkAuth = (param) => {
  if (!param) {
    const err = new Error("You are not an authenticated user!.");
    err.status = 401;
    throw err;
  }
};

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  checkAuth(authHeader);

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    error.status = 500;
    throw error;
  }

  checkAuth(decodedToken);
  req.adminId = decodedToken.id;
  next();
};

module.exports = isAuth;