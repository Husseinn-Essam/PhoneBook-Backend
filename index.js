require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/Person");

morgan.token("reqBody", function (req) {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.json());
app.use(morgan("[:method] :url :status - :response-time ms :reqBody"));
app.use(cors());
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const person = await Person.findById(id);
    response.json(person);
  } catch (error) {
    response.status(404).end();
    next(error);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const { name, number } = request.body;
  try {
    const newPerson = await Person.create({
      name: name,
      number: number,
    });
    response.json(newPerson);
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (request, response, next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number,
  };
  try {
    let updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      newPerson,
      { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    console.log("yeah thats the one !!");
    console.log(error);
    console.log("long:");
    console.log(error);
    return response.status(400).json(error.message);
  }
  response.status(500).json({ error: "Something went wrong." });

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
