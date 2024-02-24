const express = require("express");
const saveUser = require("../middleware/saveUser");
const register = express.Router();

register.post('/reg', (req, res) => {
    saveUser(req).then((data) => {
        res.status(201).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
})

module.exports = register;