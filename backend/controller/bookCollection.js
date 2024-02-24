const express = require("express");
const bookcollection = express.Router();
const verifyToken = require("../middleware/verifyToken");
const addCollection = require("../middleware/addBookCollections");
const getBook = require("../middleware/getBookFromCollection");

// Here the collection will be added using this module
bookcollection.post("/addCollection", verifyToken, (req, res, next) => {
    const bookid = req.body.bookid;
    if (!bookid || bookid.length === 0) {
        return  res.status(422).send({ error: "You must provide a book id." });
    }
    addCollection(bookid, req.user._id) // The collectoion will be added 
        .then((data) => {
            return res.status(200).send({ message: "Successfully added to collection." });
        }).catch((error) => {
            return res.status(400).send({ error: error });
    })
})


// This will search for the book and validate the token by the book id
bookcollection.get("/getBook", verifyToken,(req, res) => {
    const bookid = req.body.bookid;
    const user =req.user;
    getBook(bookid, user._id).then((data) => {
        if (!data || data.length === 0) {
            return res.status(400).send("No data found ");
        }
        return res.status(200).send(data);
    }).catch((error) => {
        return res.status(404).send(error);
    })
    
})


module.exports = bookcollection;