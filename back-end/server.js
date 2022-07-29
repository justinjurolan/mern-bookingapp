const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

// dotenv.config();

// // Local DB
// const localDB = process.env.DATABASE_LOCAL;

// mongoose
//   .connect(localDB)
//   .then(() => console.log('Local DB connection successful'));

// Cloud DB
const cloudDB = process.env.DATABASE_CLOUD.replace(
  '<username>',
  process.env.DATABASE_CLOUD_USERNAME
).replace('<password>', process.env.DATABASE_CLOUD_PASSWORD);

mongoose
  .connect(cloudDB)
  .then(() => console.log('Cloud DB connection successful'));

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down');

  server.close(() => {
    process.exit(1);
  });
});
