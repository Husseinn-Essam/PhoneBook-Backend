const mongoose = require("mongoose");
require("dotenv").config();
const password = "";
const connectionURL = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose.connect(connectionURL);

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Person", personSchema);
