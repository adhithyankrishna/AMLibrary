const { UserPreference } = require("../DBHandler/databaseConnection");
const findBook = require("./findBook");

const addCollection = (bookid, userid) => {
  return new Promise((resolve, reject) => {
    

    findBook(bookid)
      .then((data) => {
        if (!data || data.length === 0) {
          return reject(Error(`No book found with id ${bookid}`));
        }
          console.log(userid, bookid);
        UserPreference.updateOne(
          { userid: userid },
          {
            $addToSet: { bookcollection: bookid },
          }
        )
          .then((data) => {
            console.log(data);
            if (!data || data.length === 0 || !data.acknowledged) {
              reject("Server error");
            }
            resolve("Book is added");
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = addCollection;
