const express = require('express');
const router = express.Router();
const auth = require('../util/util')

router.get('/home',auth,(req,res) => {
    const user = req.user;
    const name = user.name;
    res.send(`Logged in successfully as ${name}`);
})

module.exports = router;