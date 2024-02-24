const { userComment } = require("../DBHandler/databaseConnection");
const findBook = require("./findBook");

const addComments = (userid, bookid, msg) => {
  return new Promise(async (resolve, reject) => {
    try {
    
      const result = await findBook(bookid);
     
      if (result) {
        const newComment = {
          bookid: bookid,
          userid,
          comment: msg,
        };
        userComment
          .create(newComment)
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error("No book found for this book id"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = addComments;
