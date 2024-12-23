const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  // if (body === undefined) {
  //   return response.status(400).json({ error: 'content missing' });
  // }

  // const numberExists = persons.find((person) => person.number === body.number);

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: 'The name or number is missing' });
  }
  // } else if (numberExists) {
  //   return response
  //     .status(400)
  //     .json({ error: 'The name already exists in the phonebook' });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Date.now() + Math.random(),
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.json('Not found');
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { content, important } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response) => {
  response.send(
    `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `
  );
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message, '--------------');

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
