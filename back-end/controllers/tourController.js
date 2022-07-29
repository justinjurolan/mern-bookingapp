const Tour = require('../models/tourModel');
const APIFeatures = require('../helpers/apiFeatures');
const AppError = require('../helpers/appError');
const catchErrBlock = require('../helpers/catchErrBlock');
const cloudinary = require('../helpers/cloudinary');

// FEATURES

// /tours-within-range/:distance/center/:latlng/unit/:unit
exports.getToursWithinRange = async (request, response, next) => {
  try {
    const { distance, latlng, unit } = request.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng)
      return next(
        new AppError(
          'Please provide latitude and longitude in the format of lat,lng. Example: 14.5995,120.9842',
          400
        )
      );

    const radius = unit === 'mi' ? distance / 3_963.2 : distance / 6_378.1; // radians

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius], // radius must be in radians
        },
      },
    });

    response.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

// tours/distances/:latlng/unit/:unit
exports.getNearTours = async (request, response, next) => {
  try {
    const { latlng, unit } = request.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng)
      return next(
        new AppError(
          'Please provide latitude and longitude in the format of lat,lng. Example: 14.5995,120.9842',
          400
        )
      );

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [+lng, +lat],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
      {
        $sort: {
          distance: 1,
        },
      },
    ]);

    response.status(200).json({
      status: 'success',
      data: {
        unit,
        data: distances,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getDestinations = catchErrBlock(async (request, response, next) => {
  const features = new APIFeatures(
    Tour.find({
      tags: { $in: [request.params.destinationId] },
    }),
    request.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // const tours = await Tour.find({
  //   tags: { $in: [request.params.destinationId] },
  // });

  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
// BASIC CRUD

exports.createTour = async (request, response, next) => {
  try {
    const imageCoverCloudinary = await cloudinary.uploader.upload(
      request.body.imageCover.img,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_SIGNED,
        folder: 'layag-tours',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        unique_filename: true,
        tags: [request.body.name, request.body.slug],
      }
    );

    const imagesArrCloudinary = await Promise.all(
      request.body.images.map((image) =>
        cloudinary.uploader.upload(image.img, {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_SIGNED,
          folder: 'layag-tours',
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          unique_filename: true,
          tags: [request.body.name, request.body.slug],
        })
      )
    );

    request.body.imageCover = imageCoverCloudinary.secure_url;
    request.body.images = imagesArrCloudinary.map((image) => image.secure_url);

    const newTour = await Tour.create(request.body);

    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTours = catchErrBlock(async (request, response, next) => {
  const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = async (request, response, next) => {
  try {
    const tour = await Tour.findById(request.params.id);

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTour = async (request, response, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(request.params.id);

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTour = async (request, response, next) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTour)
      return next(new AppError('No tour found with that ID', 404));

    response.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    next(err);
  }
};
