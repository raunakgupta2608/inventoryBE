const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log(`Connected to MongoDB...`))
  .catch((err) => console.error("Couldn't connect to MongoDB... ", err));

const app = express();

app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(cors());
app.use(express.json());

const userRoute = require("./routes/users");
const auth = require("./routes/auth");
const inventory = require("./routes/inventory");

app.use("/users", userRoute);
app.use("/auth", auth);
app.use("/inventory", inventory);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
