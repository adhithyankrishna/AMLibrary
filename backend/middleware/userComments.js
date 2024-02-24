const { userComment } = require("../DBHandler/databaseConnection");

const getUserComments = (userid) => {
  return new Promise((resolve, reject) => {
    if (!userid || userid.length === 0) {
      reject("No userid provided");
    }
    userComment
      .find({ userid: userid })
      .then((data) => {
        if (!data || data.length === 0) {
          reject("No user comments found");
        } else {
         
          const commentsWithoutUserId = data.map((comment) => {
            const { userid, ...commentWithoutUserId } = comment.toObject();
            return commentWithoutUserId;
          });
          resolve(commentsWithoutUserId);
        }
      })
      .catch((error) => {
        reject({ error: error });
      });
  });
};

module.exports = getUserComments;
