const { body, validationResult } = require("express-validator");

const verifyUser = async (req, res, next) => {
  await body("email")
    .isEmail()
    .normalizeEmail()
    .run(req)
    .then((data) => {
      if (!data.isEmpty()) {
        return res.status(400).send(data.errors[0].msg);
      }
    })
    .catch((error) => res.status(400).send(error));

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .run(req)
    .then((data) => {
      if (!data.isEmpty()) {
        return res.status(400).send(data.errors[0].msg);
      }
    })
    .catch((error) => res.status(400).send(error));

  next();
};

module.exports = verifyUser;
