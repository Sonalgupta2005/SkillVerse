const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getMessages,
  sendMessage
} = require("../controllers/messageController");

router.get("/swaps/:swapId/messages", authMiddleware, getMessages);
router.post("/swaps/:swapId/messages", authMiddleware, sendMessage);

module.exports = router;
