
const { userComment } = require("../DBHandler/databaseConnection");

const geBookComments = (bookid) => {
  return new Promise((resolve, reject) => {
    if (!bookid || bookid.length === 0) {
      reject("No  userid");
    }
    userComment
      .find({ bookid: bookid })
      .then((data) => {
        if (!data || data.length == 0) {
          reject("No user comment found");
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject({ error: error });
      });
  });
};

module.exports = geBookComments;
