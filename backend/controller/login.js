const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017/");
const { query, body, validationResult } = require("express-validator");
const express = require("express");
const bcrypt = require("bcrypt");
const ErrorHandling = require("../Error/ErrorHandling");
const login = express.Router();
const { User } = require("../DBHandler/databaseConnection");
const CreateToken = require("../TokenVarification");
const { verifyToken } = require("../authenticateToken");
const findUser = require("../middleware/findUser");
const jwt = require("jsonwebtoken");

// This function is also used to register the user
// When the function is called - it get the user details
const signup = async (Name, Email, Password, Phone, Role) => {
  try {
    const AlreadyExitCheck = await User.findOne({ Name: Name });
    // if the user is not existed, then the user will be entered in the database
    if (AlreadyExitCheck === null) {
      const encryptPassword = await bcrypt.hash(Password, 10);
      const result = await User.create({
        Name: Name,
        Email: Email,
        Password: encryptPassword,
        Phone: Phone,
        Role: Role,
      });
      console.log(result);
      console.log("insertion successfull");
    } else console.log("user already exist");
  } catch (error) {
    ErrorHandling.handleAPIError(error);
  }
};

login.post("/login", (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;
    // it will check the email presence in the database
    findUser(email)
      .then(async (data) => {
        if (!data || data.length === 0) {
          return res.status(401).send({ message: "User not found" });
        }
        //console.log(data);
        const ComparePassword = await bcrypt.compare(
          password,
          data[0].Password
        );

        if (ComparePassword) {
          const { _id, Name, Email, Role } = data[0];
          const token = jwt.sign({ _id, Name, Email, Role }, "iamironman", {
            expiresIn: "2h",
          });

          req.session.token = token;
          res.status(200).send({ token: token });
        } else {
          console.log(false);
          return res.status(400).send({ message: "Bad Credential" });
        }
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  } catch (error) {
    return res.status(400).send({ error: "Invalid request" });
  }
});

login.get("/login/signout", async (request, response) => {
  try {
    const name = request.query.name;
    client.connect();
    const collection = await client.db("UserDetails").collection("Personal");
    await collection.updateOne({ name: name }, { $set: { token: null } });
    console.log("Your signed out successfully !");
    response.send("Success...");
  } catch (error) {
    ErrorHandling.handleAPIError(error);
  }
});

login.post(
  "/signup",
  [
    body("Email").isEmail().normalizeEmail(),
    body("Password").isLength({ min: 8 }),
  ],
  (request, response) => {
    try {
      const Result = validationResult(request);
      console.log(Result);
      if (Result?.errors.length) {
        console.log({ Result: Result.array() });
        response.send("Error");
      } else {
        const { Name, Email, Password, Phone, Role } = request.body;
        response.send("success...");
        signup(Name, Email, Password, Phone, Role);
      }
    } catch (error) {
      ErrorHandling.handleAPIError(error);
    }
  }
);

login.get("/forgotPassword", async (request, response) => {
  try {
    const name = request.query.name;
    client.connect();
    const collection = await client.db("UserDetails").collection("Personal");
    if (name) {
      const MatchName = await collection.findOne({ name: name });
      if (MatchName === null) console.log("No User found !");
      else {
        console.log("Enter the new Password");
        const password = request.query.password;
        const bcryptPassword = await bcrypt.hash(password, 10);
        await collection.updateOne(
          { name: name },
          { $set: { password: bcryptPassword } }
        );
        console.log("Password updated !");
        response.send("Success...");
      }
    }
  } catch (error) {
    ErrorHandling.handleAPIError(error);
  }
});

module.exports = login;
