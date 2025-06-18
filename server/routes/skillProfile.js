const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillProfile = require('../models/SkillProfile');

router.post('/create', auth, async (req, res) => {
    try {
        const { skillstoTeach, skillsToLearn } = req.body;

        const newProfile = new SkillProfile({
            user: req.user,
            skillstoTeach: skillstoTeach,
            skillsToLearn: skillsToLearn
        });

        await newProfile.save();
        res.status(200).json({message: "Profile created", profile: newProfile});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});

router.put('/update', auth, async (req, res) => {
    try {
        const { skillstoTeach, skillsToLearn } = req.body;

        const updated = await SkillProfile.findOneAndUpdate(
            {user: req.user},
            {skillstoTeach, skillsToLearn},
            {new: true, upsert: true},
        );

        res.status(200).json({message: "Profile updated", profile: updated});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await SkillProfile.findOne({
            user: req.user
        }).populate('skillsToTeach')
        .populate('skillsToLearn');

        res.status(200).json({message: 'Profile fetched', profile: profile});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

