const mongoose = require('mongoose');
const SkillProfile = require('../models/SkillProfile');
const Skill = require('../models/Skill');
const User = require('../models/User');
require('dotenv').config();

// Picks N random unique items from an array
function getRandomSkills(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(skill => skill._id);
}

async function seedSkillProfiles() {
  await mongoose.connect(process.env.MONGO_URI);
  await SkillProfile.deleteMany();

  const users = await User.find();
  const skills = await Skill.find();

  for (const user of users) {
    const numTeach = Math.floor(Math.random() * 5) + 6;  // 6 to 10
    const numLearn = Math.floor(Math.random() * 5) + 6;  // 6 to 10

    const skillsToTeach = getRandomSkills(skills, numTeach);
    const skillsToLearn = getRandomSkills(skills, numLearn);

    const profile = new SkillProfile({
      user: user._id,
      skillsToTeach,
      skillsToLearn
    });

    await profile.save();
  }

  console.log(`✅ Seeded SkillProfiles with ${users.length} users`);
  process.exit();
}

seedSkillProfiles().catch(err => {
  console.error('❌ Error seeding SkillProfiles:', err);
  process.exit(1);
});
