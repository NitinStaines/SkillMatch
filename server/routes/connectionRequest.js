const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const ChatRoom = require('../models/ChatRoom');

router.post('/send', auth, async (req, res) => {
    try {
        const { toUserName } = req.body;

        const toUser = await User.findOne({ name: toUserName });
        if (!toUser) {
            return res.status(400).json({ message: 'User not found.' });
        }

        if (toUser._id.toString() === req.user) {
            return res.status(400).json({ message: 'You cannot send a request to yourself.' });
        }

        const alreadyExists = await ConnectionRequest.findOne({
            fromUser: req.user,
            toUser: toUser._id,
            status: 'pending'
        });

        if (alreadyExists) {
            return res.status(400).json({ message: 'Request already sent.' });
        }

        const newConnection = new ConnectionRequest({
            fromUser: req.user,
            toUser: toUser._id,
            status: 'pending'
        });

        await newConnection.save();

        res.status(200).json({ message: `Request sent to ${toUserName}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/incoming', auth, async (req, res) => {
    try {
        const allRequests = await ConnectionRequest.find({
            toUser: req.user,
            status: 'pending'
        })
        .populate('fromUser', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Requests fetched',
            numOfRequests: allRequests.length,
            requests: allRequests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/sent', auth, async (req, res) => {
    try {
        const requestsSent = await ConnectionRequest.find({
            fromUser: req.user,
            status: 'pending'
        }).populate('toUser', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Sent connection requests',
            count: sentRequests.length,
            requests: sentRequests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/respond/:id', auth, async (req, res) => {
    try {
      const requestId = req.params.id;
      const { status } = req.body;
  
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
  
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUser: req.user
      });
  
      if (!connectionRequest) {
        return res.status(404).json({ message: 'Connection request not found or unauthorized.' });
      }
  
      connectionRequest.status = status;
      await connectionRequest.save();
  
      if (status === 'accepted') {
        const fromUserId = connectionRequest.fromUser;
        const toUserId = connectionRequest.toUser;

        const existingRoom = await ChatRoom.findOne({
          participants: { $all: [fromUserId, toUserId], $size: 2 }
        });
  
        if (!existingRoom) {
          const chatRoom = new ChatRoom({ participants: [fromUserId, toUserId] });
          await chatRoom.save();
        }
      }
  
      res.status(200).json({
        message: `Connection request ${status}.`,
        request: connectionRequest,
        chat: status === 'accepted' ? (existingRoom ? existingRoom : chatRoom) : null
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

module.exports = router;
