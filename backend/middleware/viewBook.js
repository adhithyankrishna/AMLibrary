const { error } = require("console");
const { Book } = require("../DBHandler/databaseConnection");

const viewBook = (book) => {
  if (!book) {
    return new Error("No book provided");
  } else {
    Book.updateOne(
      { _id: book._id },
      {
        $inc: { Downloads: 1 },
      }
      )
        .then((data) => {
            //console.log("sucess");
            //console.log(data);
            return true
        }).catch((Error) => {
            console.log(Error);
            return new Error(Error);
      })
  }
};


module.exports = viewBook;
