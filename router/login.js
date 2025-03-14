const express = require('express')
const path = require('path');
const { User } = require('../models/data');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken')

router.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname,'../','views','login.html'))
})

router.post('/login', async(req,res) => {
    try{
        const {email , password} = req.body;
    
    const user = await User.findOne({where: {email}})
    if(!user){
        return res.status(404).json({message: 'email doesnt exist'})
    }
    const match = await bcrypt.compare(password, user.password);

    if(!match){
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
    res.send('Logged in successfully')
    }catch(error) {
        console.log(error);
    }
})

module.exports = router;