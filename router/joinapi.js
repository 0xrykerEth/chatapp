const express = require('express');
const auth = require('../util/util');
const { GroupMember, Group } = require('../models/data');
const { Sequelize } = require('sequelize');
const router = express.Router();

router.get('/joinapi', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const userGroups = await GroupMember.findAll({
            where: { userId },
            attributes: ['groupId'],
        });

        const userGroupIds = userGroups.map((groupMember) => groupMember.groupId);

        const availableGroups = await Group.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: userGroupIds,
                },
            },
        });

        res.json({ availableGroups });
    } catch (error) {
        console.error('Error fetching available groups:', error);
        res.status(500).send('Error fetching available groups');
    }
});


module.exports = router;