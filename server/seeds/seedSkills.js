const mongoose = require('mongoose');
const Skill = require('../models/Skill');
require('dotenv').config();

const skills = [
  { name: 'react', category: 'frontend' },
  { name: 'vue', category: 'frontend' },
  { name: 'nodejs', category: 'backend' },
  { name: 'express', category: 'backend' },
  { name: 'mongodb', category: 'backend' },
  { name: 'docker', category: 'devops' },
  { name: 'aws', category: 'devops' },
  { name: 'figma', category: 'design' },
  { name: 'photoshop', category: 'design' },
  { name: 'tailwind', category: 'frontend' },
  { name: 'python', category: 'backend' },
  { name: 'kubernetes', category: 'devops' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Skill.deleteMany();
    await Skill.insertMany(skills);
    console.log('Seeded 12 skills');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
