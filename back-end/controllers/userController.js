const User = require('../models/userModel');
const { errorHandler } = require('../helpers/dbErrorHandler');
const APIFeatures = require('../helpers/apiFeatures');
const cloudinary = require('../helpers/cloudinary');

// Get the user id
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

// Get the user profile
exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// Update user profile

exports.update = async (req, res, next) => {
  try {
    const { image, profile } = req.body;

    let cloudinaryResponse;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_SIGNED,
        folder: 'layag-users',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        unique_filename: true,
        tags: [profile.email],
      });

      const { public_id: filename, secure_url: path } = cloudinaryResponse;

      request.body.image = { filename, path };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.profile._id,
      { $set: req.body },
      { new: true }
    );
    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;

    const {
      image: { filename: prevUserImage },
    } = req.profile;

    if (prevUserImage !== 'default')
      await cloudinary.uploader.destroy(prevUserImage);

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (request, response, next) => {
  try {
    const features = new APIFeatures(User.find(), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users = await features.query;

    response.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
