const { Book, UserPreference } = require("../DBHandler/databaseConnection");
const viewBook = require("./viewBook");

const userInteraction = (user, book) => {
  if (!user || !book) {
    return Promise.reject({
      status: 422,
      msg: "User or Book information is missing",
    });
  } else {
      viewBook(book);
    return UserPreference.findOne({ userid: user._id })
      .then((userData) => {
        //console.log(userData, book.Category);
        if (userData === null) {
          // Create a new user preference document
          const newUser = {
            userid: user._id,
            category: {
              [book.Category]: 1, 
            },
            bookcollection: [],
            history: [book._id],
          };

          return UserPreference.create(newUser);
        } else {
          //console.log(userData.category[book.Category]);

          // Update existing user preference document using $inc for category
          return UserPreference.updateOne(
            { userid: user._id },
            {
              $inc: { [`category.${book.Category}`]: 1 },
              $push: { history: book._id },
            }
          );
        }
      })
      .catch((error) => {
        throw { status: 500, msg: "Internal Server Error", error };
      });
  }
};

module.exports = userInteraction;
