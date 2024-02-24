const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (req.session.token === token) {

    if (!token || token.length === 0) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, "iamironman", (err, decoded) => {
      if (err) {
        // Handle the error and send an appropriate response
        console.error(err);
        return res.status(401).send("Unauthorized, login again");
      }

      // Token is valid, set user information in the request
      req.user = decoded;

      // Continue to the next middleware or route
      next();
    });
  }
  else {
    return res.status(401).send("Invalid token");
  }
};

module.exports = verifyToken;
