const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const inventoryRouter = express.Router();
inventoryRouter.use(bodyParser.json());
const { Inventory } = require("../models/inventory");
const { Users } = require("../models/users");
const role = require("../middleware/role");

inventoryRouter
  .route("/")
  .get(auth, async (req, res) => {
    try {
      const inventory = await Inventory.find({}).populate(
        "createdBy",
        "_id firstName lastName role"
      );

      if (inventory) return res.status(200).send(inventory);
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  })
  .post(async (req, res) => {
    return res.status(400).send("POST operation not supported on /inventory");
  })
  .put(async (req, res) => {
    return res.status(400).send("PUT operation not supported on /inventory");
  })
  .delete(async (req, res) => {
    return res.status(400).send("DELETE operation not supported on /inventory");
  });

inventoryRouter
  .route("/addInventory")
  .get(auth, async (req, res) => {
    return res.status(400).send("GET operation not supported on /addInventory");
  })
  .post(async (req, res) => {
    try {
      const { inventoryName, email: userEmail, availableQty } = req.body;
      let inventory = await Inventory.findOne({
        inventoryName: inventoryName,
      }).populate("createdBy", "_id firstName lastName role");

      if (inventory)
        return res.status(400).send("Inventory already registered");

      let { _id, email, firstName, lastName, role } = await Users.findOne({
        email: userEmail,
      });

      inventory = new Inventory({
        inventoryName,
        availableQty,
        createdBy: {
          _id,
          email,
          firstName,
          lastName,
          role,
        },
      });
      await inventory.save();

      res.status(201).json({ data: "Inventory Added Successfully." });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  })
  .put(async (req, res) => {
    return res.status(400).send("PUT operation not supported on /addInventory");
  })
  .delete(async (req, res) => {
    return res
      .status(400)
      .send("DELETE operation not supported on /addInventory");
  });

inventoryRouter
  .route("/:id")
  .get(auth, async (req, res) => {
    try {
      const inventory = await Inventory.findById(req.params.id);
      if (!inventory)
        return res
          .status(404)
          .send("The inventory with the given ID was not found.");

      res
        .status(200)
        .send({ inventory, message: "Inventory Fetched successfully" });
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  })
  .post(async (req, res) => {
    return res
      .status(400)
      .send("POST operation not supported on /inventory/:id");
  })
  .put([auth, role], async (req, res) => {
    try {
      const inventory = await Inventory.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      if (!inventory)
        return res
          .status(404)
          .send("The inventory with the given ID was not found.");

      res
        .status(200)
        .send({ inventory, message: "Inventory Updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  })
  .delete([auth, role], async (req, res) => {
    try {
      const inventory = await Inventory.findByIdAndRemove(req.params.id);
      if (!inventory)
        return res
          .status(404)
          .send("The inventory with the given ID was not found.");

      return res
        .status(200)
        .send({ inventory, message: "Inventory deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(404).send(error);
    }
  });

module.exports = inventoryRouter;
