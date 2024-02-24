
const express =  require('express')
const { Book } = require("../DBHandler/databaseConnection");
const verifyToken = require('../middleware/verifyToken');
var filter = express.Router();


// These functions will particularlly filter and give the book

const FilterTitleFunction = async (Title) => {
   
    const result = await Book.find({Title:{$regex:new RegExp(Title, 'i')}}).toArray()
    console.log(result.forEach( (res,index) => console.log(index++,res.Title)))

}
const FilterYearFunction = async (StartYear, EndYear) => {
            
            const result = await Book.find({Publish:{$gte:parseInt(StartYear),$lte:parseInt(EndYear)}}).toArray()
            console.log(result.forEach( (res,index) => console.log(index++,res.Publish)))
     
    }
const FilterAuthorFunction = async (Author) => {
        
        const result = await collection.find({Author:{$regex:new RegExp(Author, 'i')}}).toArray()
        console.log(result.forEach( (res,index) => console.log(index++,res.Author)))

    }
const FilterCategoryFunction = async (Category) => {
   
    const result = await Book.find({Category:{$regex:new RegExp(Category, 'i') }}).toArray()
    console.log(result.forEach((res, index) => console.log(index++,res.Category)))

}
const FilterPageFunction = async (PageCount) => {
    
    const result = await Book.find({Page:{$lte:parseInt(PageCount)}}).toArray()
    console.log(result.forEach( (res,index) => console.log(index++,res.Page)))

}
const FilterDownloadFunction = async (Download) => {
    
    const result = await Book.find({Downloads:{$gte:parseInt(Download)}}).toArray()
    console.log(result.forEach( (res,index) => console.log(index++,res.Downloads)))
  
}



// This module filter the books based on the details and will give the update
filter.get('/filter',verifyToken,(request, response) => {
    const Title = request.query.title
    const AuthorName = request.query.author
    const Downloads = request.query.download
    const CategoryName = request.query.category
    const PageCount = request.query.page
    const startYear = request.query.startYear
    const endYear = request.query.endYear
    if(Title){
        response.send('Success...')
        FilterTitleFunction(Title)
    }
    else if(startYear && endYear){
        response.send('Success...')
        FilterYearFunction(startYear,endYear)
    }
    else if(AuthorName){
        response.send('Success...')
        FilterAuthorFunction(AuthorName)
    }
    else if(CategoryName){
        response.send('Success...')
        FilterCategoryFunction(CategoryName)    
    }
    else if(PageCount){
        response.send('Success...')
        FilterPageFunction(PageCount)   
    }
    else if(Downloads){
        response.send('Success...')
        FilterDownloadFunction(Downloads)
    }
})

module.exports = filter;
