const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let personsData = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
morgan.token("reqBody", function (req, res) {
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
  response.json(personsData);
});

app.get("/info", (request, response) => {
  const requestTime = new Date();
  const infoMessage = `<p>The Phonebook has info for ${personsData.length} persons</p>`;
  const requestTimeMessage = `<p>Request received at: ${requestTime}</p>`;

  const combinedMessage = infoMessage + requestTimeMessage;
  response.send(combinedMessage);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = personsData.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  personsData = personsData.filter((p) => p.id !== id);
  response.status(204).end();
});

function generateRandomId() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "Input is not complete!",
    });
  }
  if (personsData.some((person) => person.name === name)) {
    return response.status(409).json({
      error: "Name already exists in the phonebook.",
    });
  }

  const person = {
    name: name,
    number: number,
    id: generateRandomId(),
  };

  personsData = personsData.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
