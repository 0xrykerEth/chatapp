const express = require('express');
const { User } = require('../models/data');
const router = express.Router();


router.get('/logged', async(req,res) => {
    try{
        const userName = await User.findAll({ where: { loggedin: true } });

        res.json(userName)
    }catch(error){
        console.log(error)
    }
})

module.exports = router;