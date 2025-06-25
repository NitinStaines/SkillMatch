const mongoose = require('mongoose');

const skillProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  skillsToTeach: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Skill'
    }
  ],
  skillsToLearn: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Skill'
    }
  ],
  bio: {
    type: String,
    maxlength: 500,
    trim: true,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.models.SkillProfile || mongoose.model('SkillProfile', skillProfileSchema);
