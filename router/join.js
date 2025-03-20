const express = require('express');
const { Group, GroupMember } = require('../models/data');
const auth = require('../util/util');
const router = express.Router();

router.get('/join', auth, (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Join Groups</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f9;
            }
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                text-align: center;
                color: #333;
            }
            .group-list {
                list-style-type: none;
                padding: 0;
                margin-top: 20px;
            }
            .group-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #fff;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .group-item button {
                padding: 8px 15px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 5px;
            }
            .group-item button:hover {
                background-color: #45a049;
            }
            .message {
                text-align: center;
                margin-top: 20px;
                font-size: 18px;
                color: #333;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <h1>Join Groups</h1>

            <ul id="groupList" class="group-list"></ul>

            <p id="noGroupsMessage" class="message" style="display: none;">You are already a member of all available groups.</p>
        </div>

        <script>
            // Function to fetch available groups from the backend
            async function fetchGroups() {
                try {
                    const response = await fetch('/joinapi');
                    const data = await response.json();

                    const groupListElement = document.getElementById('groupList');
                    const noGroupsMessage = document.getElementById('noGroupsMessage');

                    if (data.availableGroups && data.availableGroups.length > 0) {
                        groupListElement.innerHTML = '';

                        data.availableGroups.forEach(group => {
                            const listItem = document.createElement('li');
                            listItem.classList.add('group-item');
                            listItem.innerHTML = \`
                                <span>\${group.name}</span>
                                <button onclick="joinGroup(\${group.id})">Join</button>
                            \`;
                            groupListElement.appendChild(listItem);
                        });

                        noGroupsMessage.style.display = 'none';
                    } else {
                        groupListElement.innerHTML = '';
                        noGroupsMessage.style.display = 'block';
                    }
                } catch (error) {
                    console.error('Error fetching groups:', error);
                    alert('There was an error fetching the groups.');
                }
            }

            async function joinGroup(groupId) {
                try {
                    const response = await fetch(\`/group/\${groupId}/join\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        alert('You have successfully joined the group!');
                        fetchGroups();  
                    } else {
                        const message = await response.text();
                        alert(message);  
                    }
                } catch (error) {
                    console.error('Error joining group:', error);
                    alert('There was an error joining the group.');
                }
            }

            fetchGroups();
        </script>

    </body>
    </html>
    `);
});

router.get('/joinapi', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const allGroups = await Group.findAll();

        const joinedGroups = await GroupMember.findAll({
            where: { userId },
            attributes: ['groupId'],
        });

        const joinedGroupIds = joinedGroups.map(g => g.groupId);

        const availableGroups = allGroups.filter(group => !joinedGroupIds.includes(group.id));

        if (availableGroups.length > 0) {
            res.json({ availableGroups });
        } else {
            res.json({ availableGroups: [] });
        }
    } catch (error) {
        console.error('Error fetching available groups:', error);
        res.status(500).send('Error fetching available groups');
    }
});

router.post('/group/:groupId/join', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.groupId;

        const existingMember = await GroupMember.findOne({
            where: { userId, groupId },
        });

        if (existingMember) {
            return res.status(400).send('You are already a member of this group');
        }

        await GroupMember.create({ userId, groupId });

        res.status(200).send('Successfully joined the group');
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).send('Error joining group');
    }
});

module.exports = router;
