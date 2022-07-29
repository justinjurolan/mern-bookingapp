const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
// const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: String,
      enum: ['user', 'guide', 'admin'],
      default: 'user',
    },
    image: {
      path: {
        type: String,
        default:
          'https://res.cloudinary.com/dqwdu3tfn/image/upload/v1658723145/layag-users/default_bu6uil.png',
      },
      filename: { type: String, default: 'default' },
    },
  },
  { timestamps: true }
);

// mongoose.virtual

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

// userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
