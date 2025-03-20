const express = require('express');
const { Group, GroupMember } = require('../models/data'); 
const router = express.Router();
const auth = require('../util/util')

router.get('/createGroup', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Create Group</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    width: 350px;
                    text-align: center;
                }
                h2 {
                    margin-bottom: 20px;
                    color: #333;
                }
                input {
                    width: 90%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background: #218838;
                }
                .error {
                    color: red;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Create a Group</h2>
                <form action="/createGroup" method="POST">
                    <input type="text" name="name" placeholder="Enter Group Name" required />
                    <button type="submit">Create Group</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

router.post('/createGroup', auth,async (req, res) => {
    try {
        
        const { name } = req.body;
        const createdBy = req.user.id;


        const newGroup = await Group.create({ name, createdBy });

        await GroupMember.create({
            userId: createdBy,
            groupId: newGroup.id
        });

        res.send(`<p style="color: green;">Group "${newGroup.name}" created successfully!</p>`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('<p class="error">Internal server error.</p>');
    }
});

module.exports = router;
