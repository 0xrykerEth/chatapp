const express = require('express');
const path = require('path');
const router = express.Router();
const {User} = require('../models/data')
const bcrypt = require('bcrypt'); 
const { where } = require('sequelize');

router.get('/signup', (req,res) => {
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
})

router.post('/signup', async(req,res) => {
    try{
        const {name,email,phone,password,loggedin } = req.body;
        console.log(loggedin);

        const userExist = await User.findOne({where : {email}})
       
        if(userExist){
            if(userExist.email === email){
                return res.status(400).json({ message: "With this email User already exists" });
             }
     
             if(userExist.phone === phone){
                 return res.status(400).json({ message: "Phone Number already exists" });
             }
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