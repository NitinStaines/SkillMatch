const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
    try{
        const { name, category } = req.body;

        const existingSkill = await Skill.findOne({ name: name.toLowerCase() });

        if (existingSkill) return res.status(400).json({message: "Skill already exists."});

        const newSkill = new Skill({name: name.toLowerCase(), category: category.toLowerCase()});
        await newSkill.save();

        res.status(201).json({message: "Skill created.", skill: newSkill});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try{
        const skills = await Skill.find();
        return res.status(200).json({message: "Skills from database.", skills: skills});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;