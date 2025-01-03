const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for authentication
const Message = require("../model/message");

// Fetch all messages in a room
routes.get("/room/:roomId", authMiddleware, async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ room: roomId }).populate(
      "sender",
      "username"
    );
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
});

// Fetch private messages between two users
routes.get("/private/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).populate("sender receiver", "username");

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching private messages",
        error: error.message,
      });
  }
});

// Send a new message
routes.post("/", authMiddleware, async (req, res) => {
  const { receiver, content, room } = req.body;

  try {
    const message = new Message({
      sender: req.user.id,
      receiver,
      content,
      room,
    });

    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
});

module.exports = routes;
