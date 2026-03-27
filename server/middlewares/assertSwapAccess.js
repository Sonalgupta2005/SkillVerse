const Swap = require("../models/SwapRequest");

module.exports = async function assertSwapAccess(swapId, userId) {
  const swap = await Swap.findById(swapId);

  if (!swap) {
    throw { status: 404, message: "Swap not found" };
  }

  if (swap.status !== "accepted") {
    throw { status: 403, message: "Chat not enabled for this swap" };
  }

  const isParticipant =
    swap.fromUser.equals(userId) || swap.toUser.equals(userId);

  if (!isParticipant) {
    throw { status: 403, message: "Not allowed" };
  }

  return swap;
};
