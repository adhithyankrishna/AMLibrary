const express = require("express");
const { User, databaseConnection } = require("../DBHandler/databaseConnection");
const login = express.Router();
const jwt = require("jsonwebtoken");
const session = require("express-session");
const findUser = require("../middleware/findUser");
const secret = "iamironman";
const bcrypt = require("bcrypt");


login.post("/login", (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;

    findUser(email).then(async (data) => {
      if (!data || data.length === 0) {
        return res.status(401).send({ message: "User not found" });
      }
       const ComparePassword = await bcrypt.compare(
          password,
          data[0].Password
        );
        if (ComparePassword) {
        const { _id, Name, Email, Role } = data[0];
        const token = jwt.sign({ _id, Name, Email, Role }, secret, {
          expiresIn: 180 * 24 * 60 * 60,
        });
        req.session.token = token;
        res.status(200).send({ token: token });
      } else {
        return res.status(400).send({ message: "Bad Credential" });
      }

    }).catch((error) => {
      return res.status(401).send(error);
    })
   
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: "Invalid request" });
  }
});


module.exports = login;
