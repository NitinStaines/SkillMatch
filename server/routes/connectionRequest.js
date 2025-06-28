const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const ChatRoom = require('../models/ChatRoom');

router.get('/my', auth, async (req, res) => {
  try {
    const userId = req.user;

    const acceptedConnections = await ConnectionRequest.find({
      status: 'accepted',
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    })
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email');

    const connections = acceptedConnections.map(req => {
      const connectedUser = req.fromUser._id.toString() === userId
        ? req.toUser
        : req.fromUser;

      return {
        _id: connectedUser._id,
        name: connectedUser.name,
        email: connectedUser.email
      };
    });

    res.status(200).json({
      message: 'Accepted connections fetched',
      count: connections.length,
      connections
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/send/:id', auth, async (req, res) => {
    try {
        const userId = req.params.id;

        const toUser = await User.findById(userId);
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

        const alreadyConnected = await ConnectionRequest.findOne({
          status: 'accepted',
          $or: [
            { fromUser: req.user, toUser: toUser._id },
            { fromUser: toUser._id, toUser: req.user }
          ]
        });

        if (alreadyConnected) {
          return res.status(400).json({ message: 'Cannot send requests to an active connection.' });
        }

        if (alreadyExists) {
            return res.status(400).json({ message: 'Request already sent.' });
        }


        const newConnection = new ConnectionRequest({
            fromUser: req.user,
            toUser: toUser._id,
            status: 'pending'
        });

        await newConnection.save();

        res.status(200).json({ message: `Request sent to ${toUser.name}` });
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
        const sentRequests = await ConnectionRequest.find({
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

    let chatRoom = null;

    if (status === 'accepted') {
      const fromUserId = connectionRequest.fromUser;
      const toUserId = connectionRequest.toUser;

      const existingRoom = await ChatRoom.findOne({
        participants: { $all: [fromUserId, toUserId], $size: 2 }
      });

      if (existingRoom) {
        chatRoom = existingRoom;
      } else {
        chatRoom = new ChatRoom({ participants: [fromUserId, toUserId] });
        await chatRoom.save();
      }
    }

    res.status(200).json({
      message: `Connection request ${status}.`,
      request: connectionRequest,
      chat: chatRoom
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/remove/:id', auth, async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const currentUserId = req.user;

    const connection = await ConnectionRequest.findOneAndDelete({
      status: 'accepted',
      $or: [
        { fromUser: currentUserId, toUser: otherUserId },
        { fromUser: otherUserId, toUser: currentUserId }
      ]
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    await ChatRoom.findOneAndDelete({
      participants: { $all: [currentUserId, otherUserId], $size: 2 }
    });

    return res.status(200).json({ message: 'Connection removed successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
