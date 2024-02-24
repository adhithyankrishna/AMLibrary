const validator = require("validator");
const express = require("express");
const { reject } = require("bluebird");
const { resolve } = require("path");
const { error } = require("console");
const dataValidation = express.Router();

const bookData = {
  URL: "string",
  Title: "string",
  Category: "string",
  Publish: "number",
  Page: "number",
  "Size (MB)": "number",
  Downloads: "number",
};

const userData = {
  Name: "string",
  Email: "string",
  Phone: "number",
  Password: "string"
  
}

const validateUrl = (url) => {
  return validator.isURL(url);
};

const validateData = (data,masterData) => {
  return new Promise((resolve, reject) => {
    Object.keys(masterData).forEach((key) => {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] !== masterData[key]) {
          return reject(`${key}: ${masterData[key]} expected`);
        }
      } else {
        reject({ error: `There is no ${key} property` });
      }
    });
    resolve(true);
  });
};

const validateBook = (book) => {
  return new Promise((resolve, reject) => {
    //console.log("from");
     validateData(book,bookData).then((data)=>{
       if (!data ) {
         reject({ error: "data is not proper" });
       } 
       else {
         if (validateUrl(book.URL)) {
           resolve(data);
         }
         else reject({ error: "Url is not proper" });
       }
     }).catch((error) => {
      // console.log(error);
       reject({ error: error });
     })
    
  })
}

const validateUser = (user) => {
  return new Promise((resolve, reject) => {
     validateData(user, userData)
       .then((data) => {
         if (!data || data.length === 0) {
           reject({ error: "data is not proper" });
         } else {
           resolve({message:"is ok"});
         }
       })
       .catch((error) => {
         // console.log(error);
         reject({ error });
       });
  })
}


module.exports = { validateBook ,validateUser};
