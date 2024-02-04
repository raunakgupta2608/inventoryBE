const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  role: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "jwtPrivateKey", {
    expiresIn: "1h",
  });
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    firstName: Joi.string().min(5).max(50),
    lastName: Joi.string().min(5).max(50),
    role: Joi.string().required(),
  });

  return schema.validate(user);
}

var Users = mongoose.model("Users", userSchema);

module.exports.Users = Users;
module.exports.validate = validateUser;
