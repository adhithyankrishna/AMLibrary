const express = require("express");
const comment = express.Router();
const { userComment } = require("../DBHandler/databaseConnection");
const  verifyToken  = require("../middleware/verifyToken");
const addComments = require("../middleware/addComments");
const getuserComments = require("../middleware/userComments");
const geBookComments = require("../middleware/bookComments");
const { error } = require("console");

<<<<<<< HEAD
// This module use to add the comments to the book 
comment.post("/addComment", verifyToken,(req, res) => {
=======
comment.post("/addComment", verifyToken, (req, res) => {
>>>>>>> 55a62b9607325791addd52b12d5cf93f86f11a71
    addComments(req.user._id, req.body.bookid, req.body.comment)
      .then((data) => {
        res.status(200).send("Added Comment Successfully!");
        }).catch((error) => {
        return res.status(400).send({"Error": "Something went wrong!"});
    })
});

// This is used to recive the comment of the user 
comment.get("/getUserComment", verifyToken, (req, res) => {
  getuserComments(req.user._id)
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(400).send({ error: "No comment found " });
      }
      return res.status(200).send(data);
    })
    .catch((error) => res.status(400).send({ error: error }));
});


// this module used get the book's comment
comment.get("/getBookComment", verifyToken, (req, res) => {
  geBookComments(req.query.bookid)
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(400).send({ error: "No comment found " });
      }
      return res.status(200).send(data);
    })
    .catch((error) => res.status(400).send({ error: error }));
});




module.exports = comment;