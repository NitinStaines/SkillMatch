const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const users = [
  { name: 'Nitin Staines', email: 'nitinstaines4@gmail.com', password: 'nitin123'},
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'alice123' },
  { name: 'Bob Smith', email: 'bob.smith@example.com', password: 'bob456' },
  { name: 'Charlie Kim', email: 'charlie.kim@example.com', password: 'charlie789' },
  { name: 'Diana Singh', email: 'diana.singh@example.com', password: 'diana321' },
  { name: 'Ethan Lee', email: 'ethan.lee@example.com', password: 'ethan654' },
  { name: 'Fiona Zhang', email: 'fiona.zhang@example.com', password: 'fiona987' },
  { name: 'George Patel', email: 'george.patel@example.com', password: 'george111' },
  { name: 'Hannah Gomez', email: 'hannah.gomez@example.com', password: 'hannah222' },
  { name: 'Ian Tan', email: 'ian.tan@example.com', password: 'ian333' },
  { name: 'Jasmine Ray', email: 'jasmine.ray@example.com', password: 'jasmine444' },
  { name: 'Kevin Liu', email: 'kevin.liu@example.com', password: 'kevin555' },
  { name: 'Laura Chen', email: 'laura.chen@example.com', password: 'laura666' },
  { name: 'Mohit Sharma', email: 'mohit.sharma@example.com', password: 'mohit777' },
  { name: 'Nina Adams', email: 'nina.adams@example.com', password: 'nina888' },
  { name: 'Oscar Rivera', email: 'oscar.rivera@example.com', password: 'oscar999' },
  { name: 'Priya Mehta', email: 'priya.mehta@example.com', password: 'priya101' },
  { name: 'Quentin Black', email: 'quentin.black@example.com', password: 'quentin202' },
  { name: 'Riya Kapoor', email: 'riya.kapoor@example.com', password: 'riya303' },
  { name: 'Samuel Nguyen', email: 'samuel.nguyen@example.com', password: 'samuel404' },
  { name: 'Tanya Verma', email: 'tanya.verma@example.com', password: 'tanya505' }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany();
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10);
      await new User({ ...user, password: hashed }).save();
    }
    console.log('Seeded realistic users');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
