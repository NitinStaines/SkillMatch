const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');

router.post('/start', auth, async (req, res) => {
    try {
      const { participantId } = req.body;
      const userId = req.user;
  
      if (participantId === userId) {
        return res.status(400).json({ message: "You cannot start a chat with yourself" });
      }
  
      let chatRoom = await ChatRoom.findOne({
        participants: { $all: [userId, participantId], $size: 2 }
      });
  
      if (!chatRoom) {
        chatRoom = new ChatRoom({ participants: [userId, participantId] });
        await chatRoom.save();
      }
  
      res.status(200).json({ message: 'Chat room ready', chatRoom });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
  

router.post('/:roomId/send', auth, async (req, res) => {
    try {
      const { text } = req.body;
      const { roomId } = req.params;
  
      const message = new Message({
        chatRoom: roomId,
        sender: req.user,
        text
      });
  
      await message.save();
  
      await ChatRoom.findByIdAndUpdate(roomId, {
        $push: { messages: message._id },
        lastMessage: message._id
      });
  
      res.status(201).json({ message: 'Message sent', messageData: message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/my', auth, async (req, res) => {
    try {
      const userId = req.user;
  
      const rooms = await ChatRoom.find({ participants: userId })
        .populate('participants', 'name email')
        .populate({
          path: 'lastMessage',
          populate: { path: 'sender', select: 'name email' }
        })
        .sort({ updatedAt: -1 });
  
      res.status(200).json({ message: 'Chat rooms fetched', rooms });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:roomId', auth, async (req, res) => {
    try {
      const { roomId } = req.params;
  
      const messages = await Message.find({ chatRoom: roomId })
        .sort({ createdAt: 1 })
        .populate('sender', 'name email');
  
      res.status(200).json({ message: 'Messages fetched', messages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
  
module.exports = router;