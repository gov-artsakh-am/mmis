const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  const adminRole = 1;
  User.findByPk(req.userId).then(user => {
    if (user.role === adminRole) {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Admin!"
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};
module.exports = authJwt;