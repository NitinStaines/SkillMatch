const mongoose = require('mongoose');
const SkillProfile = require('../models/SkillProfile');
const Skill = require('../models/Skill');
const User = require('../models/User');
require('dotenv').config();

function getRandom(arr, min = 1, max = 3) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(skill => skill._id);
}

async function seedSkillProfiles() {
  await mongoose.connect(process.env.MONGO_URI);
  await SkillProfile.deleteMany();

  const users = await User.find();
  const skills = await Skill.find();

  for (const user of users) {
    const skillsToTeach = getRandom(skills, 2, 3);
    const skillsToLearn = getRandom(skills, 1, 2);

    const profile = new SkillProfile({
      user: user._id,
      skillsToTeach,
      skillsToLearn
    });

    await profile.save();
  }

  console.log('SkillProfile seeds created for all users');
  process.exit();
}

seedSkillProfiles().catch(err => {
  console.error('Error seeding SkillProfiles:', err);
  process.exit(1);
});
