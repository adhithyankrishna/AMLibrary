const { resolve, reject } = require("bluebird");
const { UserPreference } = require("../DBHandler/databaseConnection");
const findBook = require("./findBook");

const getBook = (bookid, userid) => {
  return new Promise(async (resolve, reject) => {
    if (!userid || !bookid) {
      reject("Invalid input");
      return;
    }

    try {
      const userPreferences = await UserPreference.find({ userid: userid });

      if (!userPreferences || userPreferences.length === 0) {
        reject("No user data");
        return;
      }

      const books = [];
      const errors = [];

      // Use map to create an array of promises
      const bookPromises = userPreferences[0].bookcollection.map((book) => {
        return findBook(book)
          .then((data) => {
            if (data && data.length > 0) {
              books.push(data);
            }
          })
          .catch((error) => {
            errors.push(error);
          });
      });

      await Promise.all(bookPromises);

      resolve(books);
    } catch (error) {
      reject(error);
    }
  });
};


module.exports = getBook;