const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // role: ['user', 'employee'],
    // default: "user",
  },

  { timestamps: true }
);

//creating a model from Schema
module.exports = model("user", UserSchema);
