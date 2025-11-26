const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillProfile = require('../models/SkillProfile');
const User = require('../models/User');

router.put('/update', auth, async (req, res) => {
  try {
    const { skillsToTeach, skillsToLearn, bio } = req.body;

    const updated = await SkillProfile.findOneAndUpdate(
      { user: req.user },
      { skillsToTeach, skillsToLearn, bio },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Profile updated", profile: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await SkillProfile.findOne({ user: req.user })
        .populate('skillsToTeach', 'name')
        .populate('skillsToLearn', 'name')
        .populate('bio');

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json({ message: 'Profile fetched', profile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

router.get('/user/:userId', auth, async (req, res) => {
  try {
    const profile = await SkillProfile.findOne({ user: req.params.userId })
    .populate('skillsToTeach', 'name')
    .populate('skillsToLearn', 'name')
    .populate('bio')
    .populate('user', '-password');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

      res.status(200).json({ message: 'Profile fetched', profile});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
