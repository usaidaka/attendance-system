const jwt = require("jsonwebtoken");

const verifyTokenEmployee = (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];

    if (token == null) {
      return res.status(401).json({
        ok: false,
        message: "token unauthorized",
      });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          ok: false,
          message: "Forbidden response",
        });
      }
      req.username = decoded.username;
      req.email = decoded.email;
    });
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    console.log("midd", req.user);
    if (req.user.role === 2) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        message: "only employee can access",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = verifyTokenEmployee;