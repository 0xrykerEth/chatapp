const express = require('express');
const auth = require('../util/util')
const { User, Group, GroupMember, Message } = require('../models/data');
const router  = express.Router();


router.get('/seeGroups', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const createdGroups = await Group.findAll({
            where: { createdBy: userId }
        });

        const joinedGroups = await Group.findAll({
            include: {
                model: GroupMember,
                where: { userId },
                required: true
            }
        });

        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Groups</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    width: 80%;
                    margin: 0 auto;
                }
                h1, h2 {
                    text-align: center;
                }
                .group-item {
                    background-color: #fff;
                    border: 1px solid #ddd;
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .group-item a {
                    font-size: 18px;
                    color: #333;
                    text-decoration: none;
                }
                .group-item a:hover {
                    color: #007BFF;
                }
                .admin-controls {
                    margin-top: 10px;
                }
                input[type="text"] {
                    padding: 5px;
                    width: 200px;
                }
                button {
                    padding: 5px 10px;
                    margin-left: 5px;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
                }
                .add-btn {
                    background-color: #4CAF50;
                    color: white;
                }
                .remove-btn {
                    background-color: #FF0000;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your Groups</h1>

                <h2>Created Groups</h2>
                <ul>
        `;

        createdGroups.forEach(group => {
            html += `
                <li class="group-item">
                    <a href="/group/${group.id}">${group.name}</a>
                    <div class="admin-controls">
                        <form action="/group/${group.id}/addMember" method="POST">
                            <input type="text" name="username" placeholder="Username" required>
                            <button class="add-btn" type="submit">Add Member</button>
                        </form>

                        <form action="/group/${group.id}/removeMember" method="POST">
                            <input type="text" name="username" placeholder="Username" required>
                            <button class="remove-btn" type="submit">Remove Member</button>
                        </form>
                    </div>
                </li>
            `;
        });

        html += `</ul>`;

        html += `
                <h2>Joined Groups</h2>
                <ul>
        `;

        joinedGroups.forEach(group => {
            html += `
                <li class="group-item">
                    <a href="/group/${group.id}">${group.name}</a>
                </li>
            `;
        });

        html += `
                </ul>
            </div>
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).send('Error fetching groups');
    }
});


router.post('/group/:groupId/addMember', auth, async (req, res) => {
    try {
        const adminId = req.user.id;
        const groupId = req.params.groupId;
        const { username } = req.body;

        const group = await Group.findByPk(groupId);
        if (!group || group.createdBy !== adminId) {
            return res.status(403).send('Only the group admin can add members');
        }

        const user = await User.findOne({ where: { name: username } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const existingMember = await GroupMember.findOne({ where: { userId: user.id, groupId } });
        if (existingMember) {
            return res.status(400).send('User is already a member');
        }

        await GroupMember.create({ userId: user.id, groupId });

        res.redirect('/seeGroups');
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).send('Error adding member');
    }
});


router.post('/group/:groupId/removeMember', auth, async (req, res) => {
    try {
        const adminId = req.user.id;
        const groupId = req.params.groupId;
        const { username } = req.body;

        const group = await Group.findByPk(groupId);
        if (!group || group.createdBy !== adminId) {
            return res.status(403).send('Only the group admin can remove members');
        }

        const user = await User.findOne({ where: { name: username } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const existingMember = await GroupMember.findOne({ where: { userId: user.id, groupId } });
        if (!existingMember) {
            return res.status(400).send('User is not a member of this group');
        }

        await GroupMember.destroy({ where: { userId: user.id, groupId } });

        res.redirect('/seeGroups');
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).send('Error removing member');
    }
});




router.get('/group/:groupId', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.groupId;

        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).send('Group not found');
        }

        const isMember = await GroupMember.findOne({
            where: { userId, groupId }
        });

        if (!isMember) {
            return res.status(403).send('You are not a member of this group');
        }

        const messages = await Message.findAll({
            where: { groupId },
            include: {
                model: User,
                attributes: ['name'],
            },
            order: [['id', 'ASC']],
        });

        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Messages in ${group.name}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }
                .container {
                    width: 80%;
                    margin: 0 auto;
                    padding-top: 20px;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                .message-list {
                    margin-top: 20px;
                    padding: 0;
                    list-style: none;
                }
                .message-item {
                    background-color: #fff;
                    border: 1px solid #ddd;
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                }
                .message-item h3 {
                    margin: 0;
                    font-size: 18px;
                }
                .message-item p {
                    font-size: 14px;
                    color: #555;
                }
                .message-form {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .message-form textarea {
                    width: 80%;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    font-size: 14px;
                }
                .message-form button {
                    padding: 10px 15px;
                    border: none;
                    background-color: #4CAF50;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Messages in ${group.name}</h1>

                <ul class="message-list">
        `;

        messages.forEach(message => {
            html += `
                <li class="message-item">
                    <h3>${message.user.name}</h3>
                    <p>${message.message}</p>
                </li>
            `;
        });

        html += `
                </ul>

                <div class="message-form">
                    <form action="/group/${groupId}/sendMessage" method="POST">
                        <textarea name="message" placeholder="Write a message..." required></textarea>
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
        `;

        res.send(html);

    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).send('Error fetching messages');
    }
});


router.post('/group/:groupId/sendMessage', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.groupId;
        const { message } = req.body;

        const isMember = await GroupMember.findOne({
            where: { userId, groupId }
        });

        if (!isMember) {
            return res.status(403).send('You are not a member of this group');
        }

        const userName = req.user.name || 'Anonymous';

        await Message.create({
            userId,
            name: userName,
            groupId,
            message,
        });

        res.redirect(`/group/${groupId}`);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    }
});



module.exports = router;