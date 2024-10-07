const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// const CookieParser = require('cookie-parser');

const rateLimiter = require('express-rate-limit');

const AppError = require('./Utils/appError');
const globalErrorHandler = require('./Controllers/errorControllers');

dotenv.config({ path: './config.env' });
const tourRoutes = require('./Routes/tourRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const userRoutes = require('./Routes/userRoutes');
const reviewRoutes = require('./Routes/reviewRoutes');
const viewRoutes = require('./Routes/viewRoutes');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, 
  }),
);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

// const { whitelist } = require('validator');

// 1) Global middlewares
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set Security http headers
app.use(helmet());

//development login
if (process.env.NODEENV === 'development') {
  app.use(morgan('dev'));
}

// request rate limiter

// const limiter = rateLimiter({
//   max: 50,
//   windowMs: 5 * 60 * 60 * 1000,
//   message: 'to many requests, please try again after some time',
// });

// app.use('/api', limiter);

// Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));
// app.use(CookieParser());

//Data sanitization against NoSQL queries injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//Data sanitization against XSS
// app.use(xss());
//--------------------------test middleware-------------------------//
app.use((req, res, next) => {
  // const authHeader = req.headers.authorization;

  // // if (authHeader && authHeader.startsWith('Bearer ')) {
  // //   const token = authHeader.split(' ')[1];
  // // }

  next();
});

//....................................................................//

app.use(express.urlencoded({ extended: false }));

//----------------------------ROUTE TOURS-----------------------------//
  
app.get('/', (req, res) => {
  res.status(200).render('base');
});
app.use('/api/v1/view', viewRoutes);

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);
//--------------------------undefined Routes --------------------------//
app.use('*', (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server!!!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  next(new AppError(`can't find ${req.originalUrl} on this server!!!`, 404));
});

//----------------------------Error Handling--------------------------//
app.use(globalErrorHandler);

//-----------------------------SERVER---------------------------------//

module.exports = app;

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);
