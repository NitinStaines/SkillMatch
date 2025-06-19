const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillProfile = require('../models/SkillProfile');
const Skill = require('../models/Skill');

router.get('/', auth, async (req, res) => {
    try {
        const categoryFilter = req.query.category?.toLowerCase();
        const currentProfile = await SkillProfile.findOne({user: req.user});
        if (!currentProfile) {
            return res.status(404).json({ message: 'Skill profile not found for current user' });
        }

        const skillsToLearn = currentProfile.skillsToLearn.map(skill => skill._id.toString());

        if (!skillsToLearn || skillsToLearn.length === 0) {
            return res.status(200).json({ message: 'No skills to match yet', matches: [] });
        }

        const otherProfiles = await SkillProfile.find({
            user: { $ne: req.user },
            skillsToTeach: { $in: skillsToLearn }
        })
        .populate('user', 'email')
        .populate('skillsToTeach')
        .populate('skillsToLearn');

        const matches = otherProfiles
        .map(profile => {
            const filteredSkills = categoryFilter ? profile.skillsToTeach.filter(s => s.category === categoryFilter) : profile.skillsToTeach;

            const matchedSkills = filteredSkills.filter(skill => skillsToLearn.includes(skill._id.toString()));

            if (matchedSkills.length === 0) return null;

            const totalScore = skillsToLearn.length;
            const matchedSkillsScore = matchedSkills.length;
            const matchScore = ((matchedSkillsScore / totalScore) * 100).toFixed(2);

            return {
                user: profile.user,
                matchedSkillsScore,
                matchPercentage: `${matchScore}%`,
                matchedSkills,
                fullProfile: profile
            };
        }).filter(Boolean)

        res.status(200).json({
            message: 'Matching users found',
            count: matches.length,
            matches
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;