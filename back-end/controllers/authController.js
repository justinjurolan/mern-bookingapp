const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); // used to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
// const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
  // console.log(`req.body:`, req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        status: 'ERROR',
        message: err.message,
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

// exports.signup = (req, res) => {
//   User.findOne({ email: req.body.email }, (err, userWithSameEmail) => {
//     if (err) {
//       res.status(400).json({
//         message: 'Error getting email try again',
//       });
//     } else if (userWithSameEmail) {
//       res.status(400).json({ message: 'This email is taken' });
//     } else {
//       const newUser = new User(req.body);
//       newUser.save((err, user) => {
//         if (err) {
//           return res.status(400).json({
//             message: 'ERROR REGISTERING',
//           });
//         }
//         user.salt = undefined;
//         user.hashed_password = undefined;
//         res.json({
//           user,
//         });
//       });
//     }
//   });
// };

// exports.signup = async (req, res) => {
//   try {
//     const newUser = new User(req.body);
//     await newUser.save();
//     res.status(200).send('User has been created.');
//     newUser.salt = undefined;
//     newUser.hashed_password = undefined;
//   } catch (err) {
//     return res.status(400).json({
//       ERROR: err.message,
//     });
//   }
// };

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email doest not exist. Please signup',
      });
    }
    // if user is found make sure the email and password match
    // create authentication method in user model

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password does not match',
      });
    }

    // generate a signed token with user id and secret
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    // persist the token a 't' in cookie with expiry date
    res.cookie('t', token, {
      expire: new Date() + 9999,
    });

    // return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        email,
        name,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({
    message: 'Signout success',
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
});

exports.isAuthenticated = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  console.log(req.auth);

  if (!user) {
    return res.status(403).json({
      error: 'Access Denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 'user') {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};
