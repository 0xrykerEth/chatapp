const express = require('express');
const router = express.Router();
const auth = require('../util/util')
const path = require('path');

const { User,Message } = require('../models/data');


router.get('/home', auth, async (req, res) => {
    res.sendFile(path.join(__dirname,'../','views','home.html'));
});

router.post('/home',auth,async(req,res) => {
    try{
        const {message} = req.body;

        const user = await User.findOne({where : {id : req.user.id}});

        await Message.create({
            userId : user.id,
            name : user.name,
            message : message, 
        })

        res.redirect('/home');

    }catch(error){
        console.log(error)
    }
})

module.exports = router;