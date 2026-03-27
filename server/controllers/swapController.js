// File: controllers/swapController.js
//const asyncHandler = require('express-async-handler');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// POST /api/swaps - Create a swap request
// POST /api/swaps - Create a swap request
const createSwapRequest = async (req, res) => {
  const { toUser, offeredSkill, wantedSkill, message } = req.body;

  // 1️⃣ Prevent self request
  if (toUser.toString() === req.user._id.toString()) {
    return res.status(400).json({
      message: 'Cannot send swap request to yourself'
    });
  }

  // 2️⃣ Validate recipient
  const recipient = await User.findById(toUser);
  if (!recipient || recipient.banned) {
    return res.status(404).json({
      message: 'Recipient user not found or banned'
    });
  }

  if (recipient.profileVisibility === 'private') {
    return res.status(403).json({
      message: 'Recipient profile is private'
    });
  }

  // 3️⃣ Find any existing swap (direction + skill agnostic)
  const existingSwap = await SwapRequest.findOne({
    $or: [
      {
        fromUser: req.user._id,
        toUser,
        offeredSkill,
        wantedSkill
      },
      {
        fromUser: toUser,
        toUser: req.user._id,
        offeredSkill: wantedSkill,
        wantedSkill: offeredSkill
      }
    ]
  }).sort({ createdAt: -1 });

  // 4️⃣ Enforce rules
  if (existingSwap) {
    // ❌ Permanent block (pending / accepted)
    if (['pending', 'accepted'].includes(existingSwap.status)) {
      return res.status(409).json({
        message: 'A swap request for this skill exchange already exists'
      });
    }

    // ⏳ Rejected → 15 day cooldown
    if (existingSwap.status === 'rejected') {
      const REJECTED_COOLDOWN_DAYS = 15;
      const cooldownMs = REJECTED_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      const elapsed = Date.now() - new Date(existingSwap.updatedAt).getTime();

      if (elapsed < cooldownMs) {
        return res.status(429).json({
          message: `This swap request was declined. You can resend it after 15 days.`
        });
      }
    }

    // ⏳ Cancelled → cooldown
    if (existingSwap.status === 'cancelled') {
      const COOLDOWN_HOURS = 48;
      const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;

      const elapsed =
        Date.now() - new Date(existingSwap.updatedAt).getTime();

      if (elapsed < cooldownMs) {
        const remainingHours = Math.ceil(
          (cooldownMs - elapsed) / (60 * 60 * 1000)
        );

        return res.status(429).json({
          message: `You can resend this swap request after ${remainingHours} hours`
        });
      }
    }
  }

  // 5️⃣ Create swap
   const swap = await SwapRequest.create({
    fromUser: req.user._id,
    toUser,
    offeredSkill,
    wantedSkill,
    message: message || '',
    status: 'pending'
  });

  res.status(201).json(swap);
};


// GET /api/swaps/me - Get all swap requests related to current user
const getMySwaps = async (req, res) => {
  const sentSwaps = await SwapRequest.find({ fromUser: req.user._id })
  .populate('fromUser', 'name profilePhoto')
  .populate('toUser', 'name profilePhoto')
  .sort({ createdAt: -1 });
  
  const receivedSwaps = await SwapRequest.find({ toUser: req.user._id })
  .populate('fromUser', 'name profilePhoto')
  .populate('toUser', 'name profilePhoto')
  .sort({ createdAt: -1 });
  res.json({sentSwaps,receivedSwaps});
};

// PUT /api/swaps/:id - Update swap request status or message
const updateSwapRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const swap = await SwapRequest.findById(id);
  if (!swap) {
    res.status(404);
    throw new Error('Swap request not found');
  }

  // Only fromUser or toUser can update
  if (
    req.user._id.toString() !== swap.fromUser.toString() &&
    req.user._id.toString() !== swap.toUser.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this swap request');
  }

  if (status) {
    if (!['pending', 'accepted', 'rejected','cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    // Only recipient can accept or reject
    if (['accepted', 'rejected'].includes(status)) {
      if (req.user._id.toString() !== swap.toUser.toString()) {
        res.status(403);
        throw new Error('Only recipient can accept or reject the swap request');
      }
      if (swap.status !== 'pending') {
        res.status(400);
        throw new Error('Swap request has already been processed');
      }
    }if (['cancelled'].includes(status)) {
      if (req.user._id.toString() !== swap.fromUser.toString()) {
        res.status(403);
        throw new Error('Only user can cancel the swap request');
      }
      if (swap.status !== 'pending') {
        res.status(400);
        throw new Error('Swap request has already been processed');
      }
    }
    swap.status = status;
  }
  await swap.save();

  res.json({ message: 'Swap updated.' });
};

// DELETE /api/swaps/:id - Delete swap request
const deleteSwapRequest = async (req, res) => {
  const { id } = req.params;

  const swap = await SwapRequest.findById(id);
  if (!swap) {
    res.status(404);
    throw new Error('Swap request not found');
  }

  // Only fromUser or toUser can delete
  if (
    req.user._id.toString() !== swap.fromUser.toString() &&
    req.user._id.toString() !== swap.toUser.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this swap request');
  }

  await swap.remove();
  res.json({ message: 'Swap deleted.' });
};

module.exports = {
  createSwapRequest,
  getMySwaps,
  updateSwapRequest,
  deleteSwapRequest,
};