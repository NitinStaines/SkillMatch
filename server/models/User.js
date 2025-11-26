const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    skillsToTeach: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillProfile' }],
    skillsToLearn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SkillProfile' }],
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);