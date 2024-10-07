const mongoose = require('mongoose');

const fs = require('fs');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successfull');
  });

const tours = JSON.parse(fs.readFileSync('./starter/dev-data/data/tours.json'));
const users = JSON.parse(fs.readFileSync('./starter/dev-data/data/users.json'));
const reviews = JSON.parse(
  fs.readFileSync('./starter/dev-data/data/reviews.json'),
);

const createTour = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('data added successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deletetour = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('dat deleted succesfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === 'import') {
  createTour();
} else if (process.argv[2] === 'delete') {
  deletetour();
}
