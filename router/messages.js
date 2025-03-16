const express = require('express');
const { Message } = require('../models/data');
const router = express.Router();


router.get('/messages', async(req,res) => {
    try{
        const user = await Message.findAll()

        res.json(user)
    }catch(error){
        console.log(error)
    }
})

module.exports = router;