const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User")
const auth = require('../middleware/auth')

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

router.post('/register', async (req, res) => {
    try{
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser){  
        return res.status(400).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User({name, email, password: hashedPassword});
    await newUser.save();
    return res.status(201).json({message: "User registered successfully!"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal server error!"})
    }
});

router.post('/login', async (req, res) => {
    try{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({message: "User does not exist."});
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message: "Invalid password."});

    const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '2h'});
    return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
    });
    }
    catch(err){
        return res.status(500).json({message: 'Internal server error!'})
    }
});

router.get('/me', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user).select('-password');
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

module.exports = router;