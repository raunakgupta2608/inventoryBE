const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const inventorySchema = new Schema({
  inventoryName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  createdBy: {
    type: ObjectId,
    ref: "Users",
  },
  availableQty: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
});

function validateInventory(inventory) {
  const schema = Joi.object({
    inventoryName: Joi.string().min(5).max(50).required(),
    availableQty: Joi.string().min(1).max(50).required(),
  });

  return schema.validate(inventory);
}

var Inventory = mongoose.model("Inventory", inventorySchema);

module.exports.Inventory = Inventory;
module.exports.validate = validateInventory;
