const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const numberExists = persons.find((person) => person.number === body.number);

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: 'The name or number is missing' });
  } else if (numberExists) {
    return response
      .status(400)
      .json({ error: 'The name already exists in the phonebook' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: persons.length + 1,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.json('Not found');
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get('/info', (request, response) => {
  response.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
