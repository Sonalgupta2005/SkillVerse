const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');
const optionalauth = require('../middlewares/optionalauth');

router.get('/',
  [
    query('skill').optional().isString(),
    query('page').optional().isInt({min:1}),
    query('limit').optional().isInt({min:1,max:100}),
    query('search').optional().isString(),
  ],
  validateMiddleware,
  optionalauth,
  // authMiddleware,
  userController.getUsers
);

router.get('/:id', authMiddleware, userController.getUserById);

router.put('/me',
  authMiddleware,
  [
    body('password').optional().isLength({min:6}),
    body('name').optional().notEmpty(),
    body('location').optional().isString(),
    body('profilePhoto').optional().isString(),
    body('skillsOffered').optional().isArray(),
    body('skillsWanted').optional().isArray(),
    body('availability').optional().isArray(),
  ],
  validateMiddleware,
  userController.updateMe
);

router.put('/me/visibility',
  authMiddleware,
  [
    body('profileVisibility').isIn(['public','private']).withMessage('Visibility must be public or private')
  ],
  validateMiddleware,
  userController.updateVisibility
);

module.exports = router;