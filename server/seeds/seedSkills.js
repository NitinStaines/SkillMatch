const mongoose = require('mongoose');
const Skill = require('../models/Skill');
require('dotenv').config();

function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

const skills = [
  { name: 'react', category: 'Programming' },
  { name: 'nodejs', category: 'Programming' },
  { name: 'python', category: 'Programming' },
  { name: 'java', category: 'Programming' },
  { name: 'html', category: 'Programming' },
  { name: 'css', category: 'Programming' },

  { name: 'pandas', category: 'Data Science' },
  { name: 'numpy', category: 'Data Science' },
  { name: 'matplotlib', category: 'Data Science' },

  { name: 'tensorflow', category: 'Machine Learning' },
  { name: 'scikit-learn', category: 'Machine Learning' },

  { name: 'docker', category: 'DevOps' },
  { name: 'kubernetes', category: 'DevOps' },
  { name: 'jenkins', category: 'DevOps' },

  { name: 'aws', category: 'Cloud Computing' },
  { name: 'gcp', category: 'Cloud Computing' },

  { name: 'figma', category: 'Design' },
  { name: 'adobe xd', category: 'UI/UX' },
  { name: 'photoshop', category: 'Design' },

  { name: 'seo', category: 'Marketing' },
  { name: 'google ads', category: 'Marketing' },

  { name: 'excel', category: 'Finance' },
  { name: 'quickbooks', category: 'Finance' },

  { name: 'public speaking', category: 'Communication' },
  { name: 'english', category: 'Language' },
  { name: 'hindi', category: 'Language' },

  { name: 'teamwork', category: 'Soft Skills' },
  { name: 'leadership', category: 'Soft Skills' },

  { name: 'guitar', category: 'Music' },
  { name: 'piano', category: 'Music' },

  { name: 'drawing', category: 'Art' },
  { name: 'painting', category: 'Art' },

  { name: 'lightroom', category: 'Photography' },
  { name: 'dslr basics', category: 'Photography' },

  { name: 'content writing', category: 'Writing' },
  { name: 'copywriting', category: 'Writing' },

  { name: 'jira', category: 'Project Management' },
  { name: 'trello', category: 'Project Management' },

  { name: 'network security', category: 'Cybersecurity' },
  { name: 'ethical hacking', category: 'Cybersecurity' },

  { name: 'unity', category: 'Game Development' },
  { name: 'unreal engine', category: 'Game Development' },

  { name: 'mechanical engineering', category: 'Engineering' },
  { name: 'electrical circuits', category: 'Engineering' },

  { name: 'nursing', category: 'Healthcare' },
  { name: 'first aid', category: 'Healthcare' },

  { name: 'teaching methods', category: 'Education' },
  { name: 'curriculum design', category: 'Education' },

  { name: 'legal writing', category: 'Legal' },
  { name: 'contract law', category: 'Legal' },

  { name: 'football', category: 'Sports' },
  { name: 'basketball', category: 'Sports' },

  { name: 'baking', category: 'Cooking' },
  { name: 'indian cuisine', category: 'Cooking' },

  { name: 'notion', category: 'Miscellaneous' },
  { name: 'time management', category: 'Miscellaneous' }
];

const capitalizedSkills = skills.map(skill => ({
  ...skill,
  name: capitalizeWords(skill.name)
}));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Skill.deleteMany();
    await Skill.insertMany(capitalizedSkills);
    console.log(`✅ Seeded ${capitalizedSkills.length} skills`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
