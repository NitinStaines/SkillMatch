const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().limit(10);

    await ConnectionRequest.deleteMany();
    await ChatRoom.deleteMany();
    await Message.deleteMany();

    for (let i = 0; i < users.length - 1; i++) {
      const fromUser = users[i];
      const toUser = users[i + 1];

      const request = new ConnectionRequest({
        fromUser: fromUser._id,
        toUser: toUser._id,
        status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)]
      });
      await request.save();

      const chatRoom = new ChatRoom({
        participants: [fromUser._id, toUser._id]
      });
      await chatRoom.save();

      const msg1 = new Message({
        chatRoom: chatRoom._id,
        sender: fromUser._id,
        text: 'Hey, I’d love to connect!',
      });

      const msg2 = new Message({
        chatRoom: chatRoom._id,
        sender: toUser._id,
        text: 'Sure! Let’s chat.',
      });

      await msg1.save();
      await msg2.save();

      chatRoom.messages.push(msg1._id, msg2._id);
      chatRoom.lastMessage = msg2._id;
      await chatRoom.save();
    }

    console.log('✅ Seeded connection requests and chat rooms with messages.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
