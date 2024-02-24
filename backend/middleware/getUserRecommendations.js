const findPreference = require("./findPreference"); // Make sure the file name is correct
const { Book } = require("../DBHandler/databaseConnection");

const getUserRecommendations = async (userId) => {
  try {
    const user = await findPreference(userId);
    const totalRecommendations = 20;

    if (!user || user.length === 0) {
      throw { status: 404, msg: "User preferences not found" };
    }

    const userCategories = Object.keys(user[0].category);
    const sortedCategories = userCategories.sort(
      (a, b) => user[0].category[b] - user[0].category[a]
    );
    const topCategories = sortedCategories.slice(0, 4);

    // Calculate the recommendation count for each category based on the user's viewing ratio
    const recommendationsPerCategory = topCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: Math.ceil(
          (user[0].category[category] / userCategories.length) *
            totalRecommendations
        ),
      }),
      {}
    );

   // console.log(recommendationsPerCategory);

    // Step 3: Query Books Database
    const recommendedBooks = await Book.find({
      Category: { $in: topCategories }, // Filter by user's top categories
      Downloads: { $gt: 0 }, // Filter by books with downloads
      _id: { $nin: user[0].history }, // Exclude books the user has already viewed
    })
      .sort({
        Downloads: -1, // Sort by downloads in descending order
        RecommendationCount: -1, // Sort by recommendation count in descending order
      })
      .limit(totalRecommendations);

   // console.log(recommendedBooks);

    return recommendedBooks;
  } catch (error) {
    throw { status: 500, msg: "Internal Server Error", error };
  }
};

module.exports = getUserRecommendations;
