const express = require('express');
const SkillProfile = require('../models/SkillProfile');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
      const categoryFilter = req.query.category?.toLowerCase();
  
      const currentProfile = await SkillProfile.findOne({ user: req.user })
        .populate('skillsToTeach')
        .populate('skillsToLearn');
  
      if (!currentProfile) {
        return res.status(404).json({ message: 'Skill profile not found for current user' });
      }
  
      const skillsToLearnIds = currentProfile.skillsToLearn.map(skill => skill._id.toString());
      const skillsToTeachIds = currentProfile.skillsToTeach.map(skill => skill._id.toString());
  
      const otherProfiles = await SkillProfile.find({
        user: { $ne: req.user }
      })
        .populate('user', 'email name')
        .populate('skillsToTeach')
        .populate('skillsToLearn');
  
        const matches = otherProfiles
          .map(profile => {
            const filteredTeachSkills = categoryFilter
              ? profile.skillsToTeach.filter(s => s.category?.toLowerCase() === categoryFilter)
              : profile.skillsToTeach;
        
            const canLearnFromThem = filteredTeachSkills.filter(skill =>
              skillsToLearnIds.includes(skill._id.toString())
            );
        
            const canTeachThem = profile.skillsToLearn.filter(skill =>
              skillsToTeachIds.includes(skill._id.toString())
            );
        
            if (canLearnFromThem.length === 0 && canTeachThem.length === 0) return null;
        
            const scoreLearn = canLearnFromThem.length;
            const scoreTeach = canTeachThem.length;
            const totalPossible = skillsToLearnIds.length + skillsToTeachIds.length;
            const matchScore = ((scoreLearn + scoreTeach) / totalPossible) * 100;
        
            return {
              user: profile.user,
              matchPercentage: `${matchScore.toFixed(2)}%`,
              numericMatch: matchScore,
              canLearnFromThem,
              canTeachThem,
              fullProfile: profile
            };
          })
          .filter(Boolean)
          .sort((a, b) => b.numericMatch - a.numericMatch); 
  
      res.status(200).json({
        message: 'Matches found (unidirectional or bidirectional)',
        count: matches.length,
        matches
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
module.exports = router;