const express = require("express");
const getUserRecommendations = require("../middleware/getUserRecommendations");
const recommendation = express.Router();
const verifyToken = require('../middleware/verifyToken');


// Here this module will give the recommendation for the books 
recommendation.get("/recommendation", verifyToken, async(req, res) => {
    const result = await getUserRecommendations(req.user._id);
    if (!result) {
        res.status(400).send("Error ");
    }
    else {
        res.status(200).send(result);
    }
   
});

module.exports = recommendation;
