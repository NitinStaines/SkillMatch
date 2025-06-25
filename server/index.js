const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send("API works");
})

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const skillRoutes = require('./routes/skill');
app.use('/api/skill', skillRoutes);

const skillProfileRoutes = require('./routes/skillProfile');
app.use('/api/skillProfile', skillProfileRoutes);

const matchRoutes = require('./routes/match');
app.use('/api/match', matchRoutes);

app.use('/uploads', express.static('uploads'));

const connectionRoutes = require('./routes/connectionRequest');
app.use('/api/connections', connectionRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);




  
