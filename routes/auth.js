const Joi = require("joi");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const { Users } = require("../models/users");

const authRouter = express.Router();
authRouter.use(bodyParser.json());

authRouter.route("/login").post(async (req, res) => {
  console.log("abcd error");
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Users.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("Invalid user or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid user or password.");

  const token = user.generateAuthToken();
  const { email, firstName, lastName, role, _id } = user;
  return res
    .status(200)
    .header("x-auth-token", token)
    .send({ email, firstName, lastName, role, token, _id });
});

authRouter.route("/signup").post(async (req, res) => {
  const { error } = validateSignUp(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { email, password, firstName, lastName, role } = req.body;
    let user = await Users.findOne({ email: email });
    if (user) return res.status(400).send("User already registered");

    user = new Users({ email, password, firstName, lastName, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const { _id } = await user.save();

    const token = user.generateAuthToken();
    res
      .status(201)
      .header("x-auth-token", token)
      .send({ email, firstName, lastName, role, token, _id });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

function validateSignUp(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    firstName: Joi.string().min(5).max(255).required(),
    lastName: Joi.string().min(5).max(255).required(),
    role: Joi.string().required(),
  });

  return schema.validate(req);
}

module.exports = authRouter;
