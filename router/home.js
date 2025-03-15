const express = require('express');
const router = express.Router();
const auth = require('../util/util')
const path = require('path');
const { User,Message } = require('../models/data');
const { where } = require('sequelize');

router.get('/home', auth, async (req, res) => {
    try {
        const userName = await User.findAll({ where: { loggedin: true } });
        const chat = await Message.findAll();

        let chatHistory = chat.map(chats => `<h3>${chats.name} : <p>${chats.message}</p></h3>
            `)

        let mapName = userName
            .map(nam => `<h1>${nam.name} joined the chat</h1>`)
            .join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chat App</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                    }
                    .container {
                        display: flex;
                        justify-content: center;
                        background-color: red;
                        align-items: center;
                    }
                    .joined{
                         display: flex;
                         flex-direction: column;
                        align-items: center;
                    }
                        .chat{
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        }
                    .button {
                        display: flex;
                        justify-content: center;
                        align-content: center;
                    }
                    input {
                        width: 500px;
                        height: 50px;
                    }
                </style>
            </head>
            <body>
                <form action='/home' method='post'>
                    <div class="container">
                    <h1>Chat App</h1>
                    </div>
                    <div class='joined'>
                        ${mapName}
                    </div>
                    <div class='chat'>
                        ${chatHistory}
                    </div>
                    <div class="button">
                     <input type="text" name="message" required>
                     <button type="submit">Send</button>
                </div>
                </form>
            </body>
            </html>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
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