const mongoose = require("mongoose");
const { trim } = require("validator");

// Function to establish a connection to the MongoDB database
const databaseConnection = async () => {
  try {
    // Connect to the MongoDB database with the given URL
    await mongoose.connect(
      "mongodb+srv://adhi:greenlatin@atlascluster.m2mhk1c.mongodb.net/AMLibrary"
    );

    // Event listener for successful connection
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB library database.");
    });

    // Event listener for disconnection
    mongoose.connection.on("disconnected", () => {
      console.log("Disconnected from MongoDB library database.");
    });

    // Event listener for connection errors
    mongoose.connection.on("error", (error) => {
      console.error("Error occurred in MongoDB:", error);
    });
  } catch (error) {
    // Handle any errors that occur during the connection process
    console.error("Error connecting to MongoDB:", error);
  }
};

// Define the schema for the Book model
const bookSchema = new mongoose.Schema({
  URL: { type: String, required: true, unique: true },
  Title: { type: String, required: true },
  Category: { type: String, required: true },
  Publish: { type: Number, required: true },
  Page: { type: Number, required: true },
  "Size (MB)": { type: Number, required: true },
  Downloads: { type: Number, required: true },
});


// Create the Book model based on the defined schema
const Book = mongoose.model("Book", bookSchema);

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  Name: { type: String, required: true ,unique:true},
  Password: { type: String, required: true },
  Phone:{type:String,required:true},
  Email: { type: String, required: true ,unique:true},
  Role: { type: String, required: true },
});


// Create the User model based on the defined schema
const User = mongoose.model("User", userSchema);



const userCommentSchema = new mongoose.Schema({
  bookid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", // Reference to the Book model (adjust according to your Book model name)
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (adjust according to your User model name)
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the model
const userComment = mongoose.model("userComment", userCommentSchema);


// Define the schema
const UserPreferenceSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  category: {
    type: Map,
    of: Number,
    required: true,
  },
  bookcollection: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Reference to the Book model (adjust according to your Book model name)
      },
    ],
    unique: true,
  },
  history: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Reference to the Book model (adjust according to your Book model name)
      },
    ],
    unique: true,
  },
});

// Define the model
const UserPreference = mongoose.model(
  "UserPreference",
  UserPreferenceSchema
);




// Export the Book, databaseConnection, and User models for use in other files
module.exports = { Book, databaseConnection, User, userComment,UserPreference };
