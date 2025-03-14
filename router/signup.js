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

        const hashedpassword = await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            phone,
            password: hashedpassword,
        })
        res.status(200).json({ message: "Signed up successfully!" })
    }catch(error){
        console.log(error)
    }
})

module.exports = router;