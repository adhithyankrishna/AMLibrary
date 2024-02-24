const { User } = require("../DBHandler/databaseConnection");

const findUser = (email) => {
  return new Promise((resolve, reject) => {
    const useremail = email;
    if (!useremail) {
      reject("Not sufficesnt data");
    } else {
      User.find({ Email: useremail })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

module.exports = findUser;
