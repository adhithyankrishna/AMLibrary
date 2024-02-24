const { Book } = require("../DBHandler/databaseConnection");

const findBook = (bookid) => {
  return new Promise((resolve, reject) => {
    if (!bookid) {
      reject(new Error("No book id found"));
    } else {
      Book.find({ _id: bookid })
        .then((data) => {
          
          if (!data || data.length === 0) {
            reject(false);
          } else {
           
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

module.exports = findBook;
