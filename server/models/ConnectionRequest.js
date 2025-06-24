const express = require('express');
const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);