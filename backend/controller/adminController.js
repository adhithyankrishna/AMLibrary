const express = require("express");
const {
  Book,
  User,
  databaseConnection,
} = require("../DBHandler/databaseConnection");
const admin = express.Router();
const { validateBook } = require("../middleware/dataValidation");
const verifyToken = require("../middleware/verifyToken");

databaseConnection();

// This module delete the book by verifing the details
admin.delete("/Deletebook",verifyToken, (req, res) => {
  let key = req.query.key;
  const value = req.query.value;
    // Check the condition  
  if (
     !key ||
     key.length === 0 ||
     !value ||
     value.length === 0 ||
     req.user.Role !== "admin"
   )
     return res.status(400).send({ error: "Invalid request" });

  key = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
 
  // here the book is found and now can be delete the book
  Book.findOneAndDelete({ [key]: value })
    .then((data) => {
      if (!data) {
        return res
          .status(400)
          .send({ error: `No book found with the given ${key}` });
      }
      return res.status(201).send("Book succesufuly deleted");
    })
    .catch((error) => {
      return res.status(500).send({ error: "Server Error" });
    });
});

// used to update the details of the book 
// This is proceed using the put method
admin.put("/UpdateBook", (req, res) => {
  const key = req.body.key;
  const value = req.body.value;
  if (
    (!key || key.length === 0 || !value || value.length === 0,
    req.user.Role !== "admin")
  )
    return res.status(400).send({ error: "Invalid request" });
  key = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  
// Finds the book based on the key value
  Book.findOneAndUpdate({ [key]: value }).then((data) => {
    if (!data || data.length === 0) {
      return res
        .status(400)
        .send({ error: `The book you are trying to update  not found` });
    }
    return res.status(200).send({ message: "UPdates secessfully" });
  });
});

// This module used to replace the book 
admin.put("/Replacebook", verifyToken,(req, res) => {
  const book = req.body.book;
  if (req.user.Role !== "admin" || !book)
    return res.status(400).send({ error: "Invalid request" });
  validateBook(book)
    .then((data) => {
      if (data) {
        Book.replaceOne({ _id: book._id.$oid }, book)
          .then((data) => {
            if (!data) {
              return res.status(400).send("No book found with the given ID ");
            }
            return res
              .status(201)
              .send({ message: "Book data replaced succesufully" });
          })
          .catch((error) => {
            return res.status(500).send({ error: "Internal server Error" });
          });
      } else {
        return res.status(500).send({ error: "Server Error" });
      }
    })
    .catch((err) => {
      console.log("Error in validation", err);
      return res.status(500).send({ error: err });
    });
});

// This module will get the user and will check and validate the user
admin.get("/user",verifyToken, (req, res) => {
  const userId = req.query.userId;
  if (req.user.Role !== "admin" || !userId)
    return res.status(400).send({ error: "Invalid request" });
  User.findById(userId)
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(404).send("User Not Found");
      }
      return res.status(201).send(data);
    })
    .catch((error) => {
      return res.status(500).send("Server error");
    });
});


admin.post("/users", verifyToken,(req, res) => {
  let filterObj = req.body.filter;
  if (req.user.Role !== "admin")
    return res.status(400).send({ error: "Invalid request" });
  User.find(filterObj)
    .then((data) => {
      if (!data) return res.status(404).send("No data found for that quary");
      return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).send("server error");
    });
});


// by using this module, Insert the  book 
admin.post("/insert",verifyToken, async (req, res) => {
  try {
    let books = req.body.books;
    let response = { success: [], error: [] };

    if (!books || req.user.Role !== "admin") {
      return res.status(400).send("Invalid Request");
    }

    for (let index = 0; index < books.length; index++) {
      try {
        const book = books[index];
        let msg = await validateBook(book);

        const updatedBook = await Book.findOneAndUpdate(
          { URL: book.URL },
          book,
          {
            upsert: true,
            new: true,
          }
        );

        response.success.push({
          message: "ok",
          data: updatedBook,
        });
      } catch (error) {
        response.error.push({ index: index, error: error });
      }
    }

    res.send(response);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

module.exports = admin;
