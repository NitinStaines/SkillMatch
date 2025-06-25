const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
  attachment: {
    filename: String,
    filetype: String,
    url: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
