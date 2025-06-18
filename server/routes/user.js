const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth')

router.get('/me', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user).select('name email skillsToTeach skillsToLearn');
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal Server Error!'});
    }
});

router.put('/update-skills', auth, async (req, res) => {
    try{
        const {skillsToTeach, skillsToLearn} = req.body;
        const user = await User.findByIdAndUpdate(
            req.user,
            {skillsToTeach, skillsToLearn},
            {new: true}
        ).select('name email skillsToTeach skillsToLearn');
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Internal Server Error!'});
    }
});

module.exports = router;
