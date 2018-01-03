var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var FlixsterSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    unique: true

  },
  // `link` is required and of type String
  link: {
    type: String,
    unique: true
  },

  img: {
    type: String,
    unique: true
  }

});

// This creates our model from the above schema, using mongoose's model method
var Flixster = mongoose.model("Flixster", FlixsterSchema);

// Export the Article model
module.exports = Flixster;
