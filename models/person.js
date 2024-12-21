const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const url = process.env.MONGO_URI;
console.log('connecting to', url);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected');
  })
  .catch((error) => {
    console.log(error);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__V;
  },
});

module.exports = mongoose.model('Person', personSchema);
