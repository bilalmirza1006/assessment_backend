const express = require('express');
const { getMessagesByRoom } = require('../controllers/messageController');
// const { getMessagesByRoom } = require('../controllers/messageController');

const router = express.Router();

router.get('/:roomId', getMessagesByRoom);

module.exports = router;
