const express = require('express');
const path = require('path');
const router = express.Router();
const {User} = require('../models/data')
const bcrypt = require('bcrypt'); 

router.get('/signup', (req,res) => {
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
})

router.post('/signup', async(req,res) => {
    try{
        const {name,email,phone,password } = req.body;

        const emailCheck = await User.findOne({email})
        if(emailCheck){
           return res.status(400).json({ message: "Email already exists" });
        }

        const phoneCheck = await User.findOne({phone})
        if(phoneCheck){
            return res.status(404).json({ message: "Phone Number already exists" });
        }

        const hashedpassword = await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            phone,
            password: hashedpassword,
        })
        res.status(201).json({ message: "Signed up successfully!" })
    }catch(error){
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;