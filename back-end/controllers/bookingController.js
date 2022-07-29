const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const AppError = require('../helpers/appError');
const APIFeatures = require('../helpers/apiFeatures');
const catchErrBlock = require('../helpers/catchErrBlock');

const bookingCheckout = async (session) => {
  const {
    metadata: { tourId: tour, userId: user, tourStart, tourEnd },
    id: paymentId,
    amount_total: price,
  } = session;

  await Booking.create({
    tour,
    user,
    price: price / 100,
    tourStart,
    tourEnd,
    paymentId,
  });
};

exports.createCheckoutSession = catchErrBlock(
  async (request, response, next) => {
    const { user, tour, tourStart, tourEnd } = request.body;

    const LAYAG_DOMAIN = 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_reference_id: tour.id,
      line_items: [
        {
          name: tour.name,
          description: tour.description,
          images: [`${tour.imageCover}`],
          amount: tour.price * 100,
          currency: 'php',
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id,
        tourId: tour.id,
        tourStart,
        tourEnd,
        // tourStart: new Date(),
        // tourEnd: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
      },
      mode: 'payment',
      success_url: `${LAYAG_DOMAIN}/profile?success=true`,
      cancel_url: `${LAYAG_DOMAIN}/tourdetails/${tour.id}?canceled=true`,
    });

    response.status(200).json({
      status: 'success',
      data: {
        session,
      },
    });
  }
);

exports.webhookCheckout = (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    bookingCheckout(session);
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  response.status(200).json({ received: true });
};

exports.myBookings = (request, response, next) => {
  request.query['user'] = { _id: `${request.params.userId}` };
  next();
};

exports.createBooking = catchErrBlock(async (request, response, next) => {
  const newBooking = await Booking.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      booking: newBooking,
    },
  });
});

exports.getAllBookings = catchErrBlock(async (request, response, next) => {
  const features = new APIFeatures(Booking.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const bookings = await features.query;

  //   const bookings = await Booking.find();

  response.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getBooking = catchErrBlock(async (request, response, next) => {
  const booking = await Booking.findById(request.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.updateBooking = catchErrBlock(async (request, response, next) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    request.params.id,
    request.body,
    { runValidators: true, new: true }
  );

  if (!updatedBooking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      booking: updatedBooking,
    },
  });
});

exports.deleteBooking = catchErrBlock(async (request, response, next) => {
  const booking = await Booking.findByIdAndDelete(request.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  response.status(204).json({
    status: 'success',
    data: {
      booking: null,
    },
  });
});
