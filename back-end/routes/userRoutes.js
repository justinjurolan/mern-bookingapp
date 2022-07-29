const express = require('express');
const router = express.Router();

const {
  requireSignin,
  isAuthenticated,
  isAdmin,
} = require('../controllers/authController');

const {
  userById,
  read,
  update,
  getAllUsers,
} = require('../controllers/userController');

router.get(
  '/secret/:userId',
  requireSignin,
  isAuthenticated,
  isAdmin,
  (req, res) => {
    res.json({
      user: req.profile,
    });
  }
);

router.get('/user/:userId', requireSignin, isAuthenticated, read);
router.put('/user/:userId', requireSignin, isAuthenticated, update);

router.route('/users').get(getAllUsers);

router.param('userId', userById);

module.exports = router;
