const express = require('express');
const path = require('path');
const router = express.Router();
const {User} = require('../models/data')

router.get('/signup', (req,res) => {
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
})

router.post('/signup', async(req,res) => {
    try{
        const {name,email,phone,password } = req.body;

        await User.create({
            name,
            email,
            phone,
            password
        })
        res.send('Form submitted successfully!');
    }catch(error){
        console.log(error)
    }
})

module.exports = router;