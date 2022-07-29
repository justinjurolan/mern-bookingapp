const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const AppError = require('../helpers/appError');
const APIFeatures = require('../helpers/apiFeatures');
const catchErrBlock = require('../helpers/catchErrBlock');

exports.checkReviewValidity = catchErrBlock(async (request, response, next) => {
  // console.log(request.body.tour, request.body.user, request.body.booking);
  const booking = await Booking.findById(request.body.booking);

  if (!booking)
    return next(
      new AppError('Invalid request! No booking found with that ID', 401)
    );

  const { user, tour, tourEnd } = booking;

  if (
    (await User.findById(user).email) !==
    (await User.findById(request.body.user).email)
  )
    return next(
      new AppError(
        'Invalid user! Requested user did not match the user in the booking',
        401
      )
    );

  if (tour.id !== request.body.tour)
    return next(
      new AppError(
        'Invalid tour! Requested tour did not match the tour in the booking',
        401
      )
    );

  if (new Date() < tourEnd)
    return next(new AppError('Tour is not yet finished!', 403));

  next();
});

exports.getReviewsByTour = catchErrBlock(async (request, response, next) => {
  const queryFeatures = new APIFeatures(
    Review.find({ tour: request.params.tourId }),
    request.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await queryFeatures.query;

  response.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchErrBlock(async (request, response, next) => {
  const review = await Review.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchErrBlock(async (request, response, next) => {
  const queryFeatures = new APIFeatures(Review.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await queryFeatures.query;

  response.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchErrBlock(async (request, response, next) => {
  const review = await Review.findById(request.params.id);

  if (!review) return new AppError('No review found with that ID', 404);

  response.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = catchErrBlock(async (request, response, next) => {
  const updatedReview = await Review.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedReview) return new AppError('No review found with that ID', 404);

  response.status(200).json({
    status: 'success',
    data: {
      review: updatedReview,
    },
  });
});

exports.deleteReview = catchErrBlock(async (request, response, next) => {
  const review = await Review.findByIdAndDelete(request.params.id);

  if (!review) return new AppError('No review found with that ID', 404);

  response.status(204).json({
    status: 'success',
    data: {
      review: null,
    },
  });
});
