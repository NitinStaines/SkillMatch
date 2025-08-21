const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const auth = require('../middleware/auth');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

router.post('/chat/:roomId/send', auth, upload.single('file'), async (req, res) => {
  try {
    const { text } = req.body;
    const { roomId } = req.params;
    const file = req.file;

    const messageData = {
      text: text || '',
      sender: req.user,
      chatRoom: roomId,
      createdAt: new Date()
    };

    if (file) {
      messageData.attachment = {
        filename: file.originalname,
        filetype: file.mimetype,
        url: `/uploads/${file.filename}`
      };
    }

    const message = new Message(messageData);
    await message.save();

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Message send failed' });
  }
});

  

router.post('/:roomId/send', auth, upload.single('attachment'), async (req, res) => {
  try {
    const { text } = req.body;
    const { roomId } = req.params;
    const sender = req.user;

    const messageData = {
      text,
      sender,
      chatRoom: roomId,
    };

    if (req.file) {
      messageData.attachment = {
        filename: req.file.filename,
        filetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`
      };
    }

    const newMessage = new Message(messageData);
    await newMessage.save();

    res.status(201).json({ message: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message' });
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

        const getChatWith = (messages, myUserId) => {
          for (const msg of messages) {
            const sender = msg.sender;
            if (sender && sender._id.toString() !== myUserId.toString()) {
              return sender;
            }
          }
          return null;
        };
        
        const chatWith = getChatWith(messages, req.user);
      res.status(200).json({ message: 'Messages fetched', messages , chatWith});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/username/:userId', auth, async (req, res) => {
  try {
    const myUserId = req.user;
    const otherUserId = req.params.userId;

    // Check if the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let room = await ChatRoom.findOne({
      participants: { $all: [myUserId, otherUserId], $size: 2 }
    });

    if (!room) {
      room = new ChatRoom({ participants: [myUserId, otherUserId] });
      await room.save();
    }

    res.status(200).json({
      message: 'Room ID fetched',
      roomId: room._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
  
module.exports = router;