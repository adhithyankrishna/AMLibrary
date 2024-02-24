
const { UserPreference} = require("../DBHandler/databaseConnection");


const findPreference = (userid) => {
  return new Promise((resolve, reject) => {
    if (!userid || userid.length === 0) {
      reject("Not sufficesnt data");
    } else {
      UserPreference.find({ userid: userid })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

module.exports = findPreference;
