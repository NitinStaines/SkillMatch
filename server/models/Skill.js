const mongoose = require('mongoose');
const skillSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Programming',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Cloud Computing',
        'Design',
        'UI/UX',
        'Marketing',
        'Finance',
        'Business',
        'Language',
        'Communication',
        'Soft Skills',
        'Music',
        'Art',
        'Photography',
        'Writing',
        'Project Management',
        'Cybersecurity',
        'Game Development',
        'Engineering',
        'Healthcare',
        'Education',
        'Legal',
        'Sports',
        'Cooking',
        'Miscellaneous',
        'Other'
      ],
      required: true,
      default: 'Other'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model('Skill', skillSchema);