const Message = require("../models/Message");
const assertSwapAccess = require("../middlewares/assertSwapAccess");

exports.getMessages = async (req, res, next) => {
  try {
    const { swapId } = req.params;
    const userId = req.user._id;

    await assertSwapAccess(swapId, userId);

    const messages = await Message.find({ swapId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 }) // oldest → newest
      .limit(100); // sane limit

    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};
exports.sendMessage = async (req, res, next) => {
  try {
    const { swapId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    await assertSwapAccess(swapId, userId);

    const message = await Message.create({
      swapId,
      sender: userId,
      content
    });

    await message.populate("sender", "name avatar");

    // Broadcast the real-time message to active listeners
    const io = req.app.get('io');
    if (io) {
      io.to(swapId).emit('newMessage', message);
    }

    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};
