const mongoose = require("mongoose");
const Person = require("./Person");

if (process.argv < 3) {
  console.log("args missing , please enter password and contact to be added");
}

const password = process.argv[2];

const connectionURL = `mongodb+srv://Hussein294:${password}@cluster0.u5nn95s.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB Atlas:", error);
  });

async function addPerson() {
  try {
    const personToBeAdded = await Person.create({
      name: process.argv[3],
      number: process.argv[4],
    });

    console.log(
      `added ${personToBeAdded.name} ${personToBeAdded.number} to phonebook`
    );
  } catch (e) {
    console.log(e.message);
  }
}

async function displayAll() {
  try {
    const contacts = await Person.find({});
    console.log("phonebook:");
    contacts.forEach((c) => console.log(c.name, c.number));
  } catch (e) {
    console.log(e);
  }
}

addPerson();
displayAll().finally(() => {
  mongoose.connection.close();
});
