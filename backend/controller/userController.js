//importing  the required modules
/*eslint-disable no-unused-vars */
const verifyToken = require("../middleware/verifyToken")
const express = require("express");

//importing Database here Book is Book model
const { Book } = require("../DBHandler/databaseConnection");
const user = express.Router();

// Search the name of the book by the given query
user.get("/search", verifyToken,async (request, response,next) => {
  try {
    // get book name from query
    const BookName = request.query.Title;

    if (!BookName || typeof BookName !== "string")
      return response.status(400).send({ error: "Invalid book name" });
    const book = await Book.find({
      Title: { $regex: new RegExp(BookName, "i") },
    });
    if (!book)
      return response.status(404).send({ message: `No books found!` });
    return response.status(201).send(book);
  } catch (error) {
    return response.status(500).send({ error: "Internal server Error" });
  }
});

user.get("/getBooks", async (request, response) => {
  try {
    const { Title, Category, PublishMinYear, PublishMaxYear } = request.query;
    const qury = {};

    if (Title) {
      qury["Title"] = { $regex: new RegExp(Title, "i") };
    }
    if (Category) {
      qury["Category"] = Category;
    }
    if (PublishMinYear && PublishMaxYear) {
      const minYear = parseInt(PublishMinYear);
      const maxYear = parseInt(PublishMaxYear);

      if (minYear > maxYear) {
        return response.status(400).send({
          error:
            "Invalid request: PublishMinYear should be less than or equal to PublishMaxYear",
        });
      } else {
        qury["Publish"] = {
          $gte: minYear,
          $lte: maxYear,
        };
      }
    } else if (PublishMaxYear) {
      console.log(PublishMaxYear);
      qury["Publish"] = { $lte: parseInt(PublishMaxYear) };
    } else if (PublishMinYear) {
      console.log(PublishMinYear);
      qury["Publish"] = { $gte: parseInt(PublishMinYear) };
    }
    console.log(qury, PublishMinYear, PublishMaxYear);
    if (!Object.keys(qury).length ) {
      return response
        .status(400)
        .send({ error: "Invalid request: At least one parameter is required" });
    } else {
      const books = await Book.find(qury).sort("Publish");
      if (!books ) {
        return response
          .status(404)
          .send({ message: "No book found with given parameters" });
      }
      data = {
        length: books.length,
        data: books,
      };
      return response.status(200).send(data);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).send({ error: "Internal server error" });
  }
});

module.exports = user;
