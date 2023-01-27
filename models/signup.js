const mongoose = require("mongoose");

const signUpSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    userid: { type: String },
  },
  { collection: "login" }
);

const userCollection = mongoose.model("login", signUpSchema);

module.exports = userCollection;
