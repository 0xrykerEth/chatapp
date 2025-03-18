const express = require('express');
const { Message } = require('../models/data');
const { Op } = require('sequelize');
const router = express.Router();
const auth = require('../util/util')


router.get('/messages', auth, async (req, res) => {
    try {
        const lastMessageId = parseInt(req.query.lastMessageId) || 0;

        const messages = await Message.findAll({
            where: { id: { [Op.gt]: lastMessageId } },
            order: [['id', 'ASC']]
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
module.exports = router;