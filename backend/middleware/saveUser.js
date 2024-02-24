const { validateUser } = require("./dataValidation");
const findUser = require("./findUser");
const { User } = require("../DBHandler/databaseConnection");

const saveUser = (req) => {
  return new Promise((resolve, reject) => {
    const userObject = req.body.userdata;

    if (!userObject || Object.keys(userObject).length === 0) {
      reject({ error: "User details are not provided" });
      return;
    }

    validateUser(userObject)
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          reject({ error: "Validation failed" });
          return;
        }

        findUser(userObject.Email)
          .then((foundUser) => {
            if (foundUser && foundUser.length > 0) {
              reject({ error: "User already exists" });
              return;
            }
            const newUser = new User(userObject);
            newUser
              .save()
              .then((savedUser) => {
                resolve({
                  message: "User saved successfully",
                  user: savedUser,
                });
              })
              .catch((error) => {
                reject({ error: error});
              });
          })
          .catch((error) => {
            reject({ error: error });
          });
      })
      .catch((error) => {
        reject({ error: error });
      });
  });
};

module.exports = saveUser;
