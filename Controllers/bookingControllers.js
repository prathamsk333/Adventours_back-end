const Tour = require('../models/tourModel');
const Booking = require('../models/bookingsModel');

const catchAsync = require('../Utils/catchAsync');

const AppError = require('../Utils/appError');

const factory = require('./handlerFactory');

const Razorpay = require('razorpay');

const crypto = require('crypto');

exports.getChecoutSession = catchAsync(async (req, res, next) => {
  // 1)  Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  // 2) Create checkout session

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const options = req.body;
  const order = await razorpay.orders.create(options);
  order.tourID = req.params.tourID;

  if (!order) {
    return res.status(500).send('Error');
  }

  res.json(order);

  // 3) Create session as response
});

exports.validateOrder = catchAsync(async (req, res, next) => {
  const { order_id, payment_id, signature } = req.body;
  console.log(req.body);
  const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
  sha.update(`${order_id}|${payment_id}`);
  const digest = sha.digest('hex');
  console.log('this is digest: ' + digest);
  console.log('this is signature: ' + signature);

  if (digest !== signature) {
    console.log('bad');
    return res.status(400).send('Transaction not legit!');
  }

  console.log(
    req.body.checkoutData.amount,
    req.body.checkoutData.tourID,
    req.user
  );

  // let tour = await Tour.findById(req.params.id);

  await Booking.create({
    price: req.body.checkoutData.amount,
    user: req.user.id,
    tour: req.body.checkoutData.tourID,
  });

  console.log('good');
  res.status(200).json({
    status: 'ok',
    order_id: order_id,
    paymentId: payment_id,
  });
});
  