const { UserPreference,Book } = require("../DBHandler/databaseConnection");


const getbook = (bookid,userid) => {
    UserPreference.findOne({
        userid: userid,
        bookcollection :{$in:bookid}
    }).then((data) => {
        if (!data || data.length === 0) {
            return new Error("No book dound");
        }
    }).catch((error) => {
        console.log(error);
    })
}


module.exports = getbook;