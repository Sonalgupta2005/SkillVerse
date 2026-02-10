// File: routes/swaps.js
const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  createSwapRequest,
  getMySwaps,
  updateSwapRequest,
  deleteSwapRequest,
} = require('../controllers/swapController');

const router = express.Router();

// POST /api/swaps
router.post(
  '/',
  auth,
  [
    body('toUser').isMongoId().withMessage('toUser must be a valid user ID'),
    body('offeredSkill').isString().notEmpty().withMessage('offeredSkill is required'),
    body('wantedSkill').isString().notEmpty().withMessage('wantedSkill is required'),
    body('message').optional().isString(),
  ],
  validate,
  createSwapRequest
);

// GET /api/swaps/me
router.get('/me', auth, getMySwaps);

// PUT /api/swaps/:id
router.put(
  '/:id',
  auth,
  [
    param('id').isMongoId().withMessage('Swap ID must be valid'),
    body('status').optional().isIn(['pending', 'accepted', 'rejected', 'cancelled']).withMessage('Invalid status'),
  ],
  validate,
  updateSwapRequest
);

// DELETE /api/swaps/:id
router.delete(
  '/:id',
  auth,
  [param('id').isMongoId().withMessage('Swap ID must be valid')],
  validate,
  deleteSwapRequest
);

module.exports = router;